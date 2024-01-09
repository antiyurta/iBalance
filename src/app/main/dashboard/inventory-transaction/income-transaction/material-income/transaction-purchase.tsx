import NewCard from "@/components/Card";
import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space } from "antd";
import Image from "next/image";
import { EditableTablePurchase } from "./editableTablePurchase";
import { useContext, useEffect, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { ConsumerSelect } from "@/components/consumer-select";
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import { IDataTransaction } from "@/service/document/transaction/entities";
import { hasUniqueValues } from "@/feature/common";
interface IProps {
  selectedDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
}
export const TransactionPurchase = (props: IProps) => {
  const { selectedDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataDocument) => {
    blockContext.block();
    values.movingStatus = MovingStatus.Purchase;
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
  const generateCode = async () => {
    blockContext.block();
    await DocumentService.generateCode({
      movingStatus: MovingStatus.Purchase,
    })
      .then((response) => {
        if (response.success) {
          form.setFieldValue("code", response.response);
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getWarehouses({});
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
          incomeQty: transaction.incomeQty,
          transactionAt: dayjs(transaction.transactionAt),
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
          <Image
            src={"/images/UploadIcon.svg"}
            width={24}
            height={24}
            alt="downloadIcon"
          />
        </Space>
      </Col>
      <Col span={24}>
        <NewCard>
          <Form form={form} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Баримтын дугаар" name="code">
                  <NewInput disabled />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Огноо" name="documentAt">
                  <NewDatePicker format={"YYYY-MM-DD"} />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Байршил"
                  name="warehouseId"
                  rules={[
                    {
                      required: true,
                      message: "Тушаалын дугаар оруулна уу.",
                    },
                  ]}
                >
                  <NewFilterSelect
                    options={warehouses.map((warehouse) => ({
                      value: warehouse.id,
                      label: warehouse.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Нийлүүлэгчийн код нэр">
                  <ConsumerSelect form={form} rules={[]} name={"consumerId"} />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Гүйлгээний утга"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewInput />
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form.List
              name="transactions"
              rules={[
                {
                  validator: async (_, transactions) => {
                    const arr = Array.isArray(transactions)
                      ? transactions.map((item: IDataTransaction) => {
                          return `${item.materialId}-${dayjs(
                            item.transactionAt
                          ).format("YYYY/MM/DD")}`;
                        })
                      : [];
                    if (!hasUniqueValues(arr)) {
                      return Promise.reject(
                        new Error(
                          "Барааны код дуусах хугацаа давхардсан байна."
                        )
                      );
                    }
                  },
                },
              ]}
            >
              {(items, { add, remove }, { errors }) => (
                <>
                  <EditableTablePurchase
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
