"use client";
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Col, Form, Row, Space } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import NewCard from "@/components/Card";
import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { EditableTableCencus } from "./editableTableCencus";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import { IDataTransaction } from "@/service/document/transaction/entities";
import { hasUniqueValues } from "@/feature/common";
import { FormCensusDocument } from "@/types/form";
type Props = {
  selectedDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
};
const TransactionCencus: React.FC<Props> = ({ selectedDocument, onSave }) => {
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<FormCensusDocument>();
  const warehouseId = Form.useWatch("warehouseId", form);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);

  const negativeNumber = (value: number): number => {
    return -value;
  };
  const getWarehouses = () => {
    WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: FormCensusDocument) => {
    blockContext.block();
    if (selectedDocument) {
      await DocumentService.patch(selectedDocument.id, {
        id: selectedDocument.id,
        warehouseId: values.warehouseId,
        documentAt: values.documentAt,
        employeeId: values.employeeId,
        description: values.description,
        movingStatus: MovingStatus.Cencus,
        transactions: values.transactions.map((item) => ({
          materialId: item.materialId,
          unitAmount: item.unitAmount,
          lastQty: item.lastQty,
          transactionAt: item.transactionAt.toString(),
          censusQty: item.censusQty,
          incomeQty:
            item.censusQty - item.lastQty > 0
              ? item.censusQty - item.lastQty
              : 0,
          expenseQty:
            item.censusQty - item.lastQty < 0
              ? negativeNumber(item.censusQty - item.lastQty)
              : 0,
          totalAmount: item.censusQty * item.unitAmount,
          description: item.description,
        })),
      })
        .then((response) => {
          if (response.success) {
            form.resetFields();
            onSave?.(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      DocumentService.post({
        id: 0,
        code: values.code,
        warehouseId: values.warehouseId,
        documentAt: values.documentAt,
        employeeId: values.employeeId,
        description: values.description,
        movingStatus: MovingStatus.Cencus,
        transactions: values.transactions.map((item) => ({
          materialId: item.materialId,
          unitAmount: item.unitAmount,
          lastQty: item.lastQty,
          transactionAt: item.transactionAt.toString(),
          censusQty: item.censusQty,
          incomeQty:
            item.censusQty - item.lastQty > 0
              ? item.censusQty - item.lastQty
              : 0,
          expenseQty:
            item.censusQty - item.lastQty < 0
              ? negativeNumber(item.censusQty - item.lastQty)
              : 0,
          totalAmount: item.censusQty * item.unitAmount,
          description: item.description,
        })),
      })
        .then((res) => {
          if (res.success) {
            form.resetFields();
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const generateCode = async () => {
    blockContext.block();
    await DocumentService.generateCode({
      movingStatus: MovingStatus.Cencus,
    })
      .then((response) => {
        if (response.success) {
          form.setFieldValue("code", response.response);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const employees = useMemo(() => {
    console.log("warehouseId", warehouseId);
    return (
      warehouses.find((warehouse) => warehouse.id === warehouseId)?.employees ||
      []
    );
  }, [warehouseId]);
  useEffect(() => {
    getWarehouses();
    generateCode();
  }, []);
  useEffect(() => {
    if (selectedDocument) {
      form.setFieldsValue({
        code: selectedDocument?.code,
        warehouseId: selectedDocument?.warehouseId,
        documentAt: dayjs(selectedDocument?.documentAt),
        description: selectedDocument?.description,
        employeeId: selectedDocument?.employeeId,
        transactions: selectedDocument.transactions.map((item) => ({
          materialId: item.materialId,
          name: item.material?.name,
          measurement: item.material?.measurement.shortName,
          countPackage: item.material?.countPackage,
          unitAmount: item.unitAmount,
          lastQty: item.lastQty,
          transactionAt: dayjs(item.transactionAt),
          censusQty: item.censusQty,
          diffQty: (item.censusQty || 0) - (item.lastQty || 0),
          totalAmount: item.totalAmount,
          description: item.description,
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
              <Form.Item
                label="Хариуцсан нярав"
                name="employeeId"
                rules={[
                  { required: true, message: "Хариуцсан нярав оруулна уу" },
                ]}
              >
                <NewFilterSelect
                  options={employees.map((item) => ({
                    value: item.id,
                    label: `${item.lastName}. ${item.firstName}`,
                  }))}
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
            {form.getFieldValue("documentAt") &&
              form.getFieldValue("warehouseId") && (
                <div style={{ overflow: "auto", maxHeight: "500px" }}>
                  <Form.List
                    name="transactions"
                    rules={[
                      {
                        validator: async (_, transactions) => {
                          const arr = Array.isArray(transactions)
                            ? transactions.map(
                                (trans: IDataTransaction) => trans.materialId
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
                        <EditableTableCencus
                          data={items}
                          form={form}
                          isEditing={Boolean(selectedDocument)}
                          add={add}
                          remove={remove}
                        />
                        <div style={{ color: "#ff4d4f" }}>{errors}</div>
                      </>
                    )}
                  </Form.List>
                </div>
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
export default TransactionCencus;
