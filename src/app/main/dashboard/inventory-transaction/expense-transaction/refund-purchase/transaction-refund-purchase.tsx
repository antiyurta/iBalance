"use client";
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Col, Form, Row, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NewCard from "@/components/Card";
import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { ConsumerSelect } from "@/components/consumer-select";
import { EditableTableRefundPurchase } from "./editableTableRefundPurchase";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import { IDataTransaction } from "@/service/document/transaction/entities";
import { hasUniqueValues } from "@/feature/common";
interface IProps {
  selectedDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
}
const TransactionRefundPurchase = (props: IProps) => {
  const { selectedDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const documentAt = Form.useWatch("documentAt", form);
  const warehouseId = Form.useWatch("warehouseId", form);

  const getWarehouses = () => {
    WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const generateCode = async () => {
    blockContext.block();
    await DocumentService.generateCode({
      movingStatus: MovingStatus.PurchaseReturn,
    })
      .then((response) => {
        if (response.success) {
          form.setFieldValue("code", response.response);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const onFinish = async (values: IDataDocument) => {
    values.movingStatus = MovingStatus.PurchaseReturn;
    blockContext.block();
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
      await DocumentService.post(values)
        .then((response) => {
          if (response.success) form.resetFields();
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getWarehouses();
    generateCode();
  }, []);
  useEffect(() => {
    if (!selectedDocument) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
      form.setFieldsValue({
        ...selectedDocument,
        documentAt: dayjs(selectedDocument.documentAt),
        transactions: selectedDocument.transactions?.map((transaction) => ({
          materialId: transaction.materialId,
          name: transaction.material?.name,
          measurement: transaction.material?.measurement.name,
          countPackage: transaction.material?.countPackage,
          lastQty: transaction.lastQty,
          expenseQty: transaction.expenseQty,
          transactionAt: dayjs(transaction.transactionAt),
          refundDocumentId: transaction.refundDocumentId,
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 12,
              }}
            >
              <Form.Item label="Баримтын дугаар" name="code">
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
              <Form.Item label="Нийлүүлэгчийн код, нэр">
                <ConsumerSelect
                  form={form}
                  name={"consumerId"}
                  rules={[
                    {
                      required: true,
                      message: "Нийлүүлэгчийн код, нэр оруулна уу.",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Буцаалтын шалтгаан"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Буцаалтын шалтгаан оруулна уу.",
                  },
                ]}
              >
                <NewInput />
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
            {documentAt && warehouseId && (
              <Form.List
                name="transactions"
                rules={[
                  {
                    validator: async (_, transactions) => {
                      const arr = Array.isArray(transactions)
                        ? transactions.map(
                            (item: IDataTransaction) => item.materialId
                          )
                        : [];
                      if (!hasUniqueValues(arr)) {
                        return Promise.reject(
                          new Error("Барааны код давхардсан байна.")
                        );
                      }
                    },
                  },
                ]}
              >
                {(items, { add, remove }, { errors }) => (
                  <>
                    <EditableTableRefundPurchase
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
            )}
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
export default TransactionRefundPurchase;
