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
import { EditableTableCencus } from "./editableTableCencus";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import { IDataTransaction } from "@/service/document/transaction/entities";
import { hasUniqueValues } from "@/feature/common";
import { IDataEmployee } from "@/service/employee/entities";
interface IProps {
  selectedDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
}
const TransactionCencus = (props: IProps) => {
  const { selectedDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [employees, setEmployees] = useState<IDataEmployee[]>([]);

  const getWarehouses = () => {
    WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataDocument) => {
    blockContext.block();
    values.movingStatus = MovingStatus.Cencus;
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
      movingStatus: MovingStatus.Cencus,
    })
      .then((response) => {
        if (response.success) {
          form.setFieldValue("code", response.response);
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getWarehouses();
    generateCode();
  }, []);
  useEffect(() => {
    if (selectedDocument) {
      form.setFieldsValue({
        ...selectedDocument,
        documentAt: dayjs(selectedDocument.documentAt),
        transactions: selectedDocument.transactions?.map((transaction) => ({
          materialId: transaction.materialId,
          name: transaction.material?.name,
          measurement: transaction.material?.measurement.name,
          countPackage: transaction.material?.countPackage,
          unitAmount: transaction.unitAmount || 0,
          lastQty: transaction.lastQty,
          quantity:
            transaction.lastQty || 0 + (transaction.excessOrDeficiency || 0),
          excessOrDeficiency: transaction.excessOrDeficiency,
          totalAmount: transaction.amount,
          description: transaction.description,
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
                  onChange={(id) => {
                    form.resetFields(["employeeId"]);
                    const employees =
                      warehouses.find((warehouse) => warehouse.id === id)
                        ?.employees || [];
                    setEmployees(employees);
                  }}
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
            <div style={{ overflow: "auto", maxHeight: "500px" }}>
              <Form.List
                name="transactions"
                rules={[
                  {
                    validator: async (_, transactions) => {
                      const arr = Array.isArray(transactions)
                        ? transactions.map(
                            (trans: IDataTransaction) =>
                              `${trans.materialId}-${dayjs(
                                trans.transactionAt
                              ).format("DD/MM/YYYY")}`
                          )
                        : [];
                      if (!hasUniqueValues(arr)) {
                        return Promise.reject(
                          new Error("Барааны код дуусах огноо давхардсан байна.")
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
                      add={add}
                      remove={remove}
                    />
                    <div style={{ color: "#ff4d4f" }}>{errors}</div>
                  </>
                )}
              </Form.List>
            </div>
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
