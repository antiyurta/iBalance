"use client";
import { IDataDocument } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Col, Form, Row, Space, Typography, message } from "antd";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NewCard from "@/components/Card";
import {
  NewDatePicker,
  NewFilterSelect,
  NewInput,
  NewInputNumber,
} from "@/components/input";
import { ConsumerSelect } from "@/components/consumer-select";
import { EditableTableSale } from "./editableTableSale";
import {
  IDataReferencePaymentMethod,
  IParamPaymentMethod,
} from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
interface IProps {
  selectedDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
}
const TransactionSale = (props: IProps) => {
  const { selectedDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    IDataReferencePaymentMethod[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getPaymentMethods = (params: IParamPaymentMethod) => {
    ReferencePaymentMethodService.get(params).then((response) => {
      if (response.success) {
        setPaymentMethods(response.response);
      }
    });
  };
  const onFinish = async (values: IDataDocument) => {
    blockContext.block();
    values.paymentMethodIds = [...values.paymentMethodIds];
    if (selectedDocument) {
      await DocumentService.patch(selectedDocument.id, values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            onSave?.(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      await DocumentService.postSale(values)
        .then((response) => {
          if (response.success) form.resetFields();
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getWarehouses({});
    getPaymentMethods({});
  }, []);
  useEffect(() => {
    if (!selectedDocument) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
      form.setFieldsValue({
        ...selectedDocument,
        discountAmount: Number(selectedDocument.discountAmount),
        documentAt: dayjs(selectedDocument.documentAt),
        transactions: selectedDocument.transactions?.map((transaction) => ({
          materialId: transaction.materialId,
          name: transaction.material?.name,
          measurement: transaction.material?.measurement.name,
          countPackage: transaction.material?.countPackage,
          lastQty: transaction.lastQty,
          unitAmount: Number(transaction.unitAmount),
          expenseQty: transaction.expenseQty,
          totalAmount: Number(transaction.totalAmount),
          discountAmount: Number(transaction.discountAmount),
        })),
      });
    }
  }, [selectedDocument]);
  return (
    <Row gutter={[12, 24]}>
      <Col span={24}>
        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
          size={12}
        >
          <Image
            src={"/images/PrintIcon.svg"}
            width={24}
            height={24}
            alt="printIcon"
          />
          <Image
            src={"/images/DownloadIcon.svg"}
            width={24}
            height={24}
            alt="downloadIcon"
          />
        </Space>
      </Col>
      <Col span={24}>
        <NewCard>
          <Form form={form} layout="vertical">
            {/* TODO xl md sm style хийх @Amarbat */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 12,
              }}
            >
              <Form.Item label="Баримтын дугаар" name="id">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Огноо" name="documentAt">
                <NewDatePicker format={"YYYY-MM-DD"} />
              </Form.Item>
              <Form.Item
                label="Байршил"
                name="warehouseId"
                rules={[{ required: true, message: "Байршил оруулна уу" }]}
              >
                <NewFilterSelect
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.id,
                    label: warehouse.name,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Харилцагчийн код, нэр">
                <ConsumerSelect
                  form={form}
                  rules={[
                    {
                      required: true,
                      message: "Харилцагчийн код, нэр оруулна уу.",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Гүйлгээний утга"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Гүйлгээний утга оруулна уу.",
                  },
                ]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                label="Төлбөрийн хэлбэр"
                name="paymentMethodIds"
                rules={[
                  {
                    required: true,
                    message: "Төлбөрийн хэлбэр оруулна уу.",
                  },
                ]}
              >
                <NewFilterSelect
                  options={paymentMethods.map((paymentMethod) => ({
                    value: paymentMethod.id,
                    label: paymentMethod.name,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Нийт дүн" name="amount" shouldUpdate>
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item
                label="Бараа материалын үнийн хөнгөлөлт"
                name="discountAmount"
              >
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item
                label="Харилцагчийн хөнгөлөлт"
                name="consumerDiscountAmount"
              >
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item label="Төлөх дүн" name="payAmount">
                <NewInputNumber disabled />
              </Form.Item>
            </div>
            <Space size={12} wrap></Space>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form.List name="transactions" rules={[]}>
              {(items, { add, remove }, { errors }) => (
                <>
                  <EditableTableSale
                    data={items}
                    form={form}
                    add={add}
                    remove={remove}
                    isEdit={isEdit}
                  />
                  <div style={{ color: "#ff4d4f" }}>{errors}</div>
                </>
              )}
            </Form.List>
          </Form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              paddingTop: 12,
            }}
          >
            <Button
              type="primary"
              onClick={() =>
                form.validateFields().then((values) => {
                  onFinish(values);
                })
              }
            >
              Хадгалах
            </Button>
          </div>
        </NewCard>
      </Col>
    </Row>
  );
};
export default TransactionSale;
