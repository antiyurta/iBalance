"use client";
import { DocumentService } from "@/service/document/service";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Col, Form, Row, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NewCard from "@/components/Card";
import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { EditableTableMove } from "./editableTableMove";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import { IDataTransaction } from "@/service/document/transaction/entities";
import { hasUniqueValues } from "@/feature/common";
import { EmployeeService } from "@/service/employee/service";
import { IDataEmployee } from "@/service/employee/entities";
import { IDataWarehouseDocument } from "@/service/document/warehouse-document/entities";
import { WarehouseDocumentService } from "@/service/document/warehouse-document/service";
import { MovingStatus } from "@/service/document/entities";
import NewModal from "@/components/modal";
import Booking from "../../../ordering-distribution/booking";
interface IProps {
  selectedDocument?: IDataWarehouseDocument;
  onSave?: (state: boolean) => void;
}
const TransactionMove = (props: IProps) => {
  const { selectedDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<IDataWarehouseDocument>();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [incomeEmployees, setIncomeEmployees] = useState<IDataEmployee[]>([]);
  const [expenseEmployees, setExpenseEmployees] = useState<IDataEmployee[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOrderModal, setIsOrderModal] = useState<boolean>(false);

  const getWarehouses = () => {
    WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataWarehouseDocument) => {
    blockContext.block();
    if (selectedDocument) {
      await WarehouseDocumentService.patch(selectedDocument.id, values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            onSave?.(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      await WarehouseDocumentService.post(values)
        .then((response) => {
          if (response.success) form.resetFields();
        })
        .finally(() => blockContext.unblock());
    }
  };
  const generateCode = async () => {
    blockContext.block();
    await DocumentService.generateCode({
      movingStatus: MovingStatus.MovementInWarehouse,
    })
      .then((response) => {
        if (response.success) {
          form.setFieldValue("code", response.response);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const getEmployee = async (warehouseId: number): Promise<IDataEmployee[]> => {
    blockContext.block();
    return await EmployeeService.get({ warehouseId })
      .then((response) => {
        if (response.success) {
          return response.response.data;
        } else {
          return [];
        }
      })
      .finally(() => blockContext.unblock());
  };
  const onEdit = async () => {
    blockContext.block();
    setIsEdit(true);
    if (selectedDocument) {
      setExpenseEmployees(
        await getEmployee(selectedDocument.expenseWarehouseId)
      );
      setIncomeEmployees(await getEmployee(selectedDocument.incomeWarehouseId));
      form.setFieldsValue({
        ...selectedDocument,
        documentAt: dayjs(selectedDocument.documentAt),
        transactions: selectedDocument.transactions?.map((transaction) => ({
          materialId: transaction.materialId,
          name: transaction.material?.name,
          measurement: transaction.material?.measurement.name,
          countPackage: transaction.material?.countPackage,
          lastQty: transaction.lastQty,
          unitAmount: Number(transaction.unitAmount),
          expenseQty: transaction.expenseQty,
        })),
      });
    }
    blockContext.unblock();
  };
  useEffect(() => {
    getWarehouses();
    generateCode();
  }, []);
  useEffect(() => {
    if (!selectedDocument) {
      setIsEdit(false);
    } else {
      onEdit();
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
          <Button
            icon={
              <Image
                src={"/images/settingsGreen.svg"}
                width={24}
                height={24}
                alt="Захиалга олгох"
              />
            }
            onClick={() => setIsOrderModal(true)}
          >
            Захиалга олгох
          </Button>
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
                label="Зарлага гаргах байршил"
                name="expenseWarehouseId"
                rules={[{ required: true, message: "Байршил оруулна уу" }]}
              >
                <NewFilterSelect
                  onSelect={async (value) => {
                    const employees = await getEmployee(value);
                    setExpenseEmployees(employees);
                  }}
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.id,
                    label: warehouse.name,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Зарлага гаргах нярав" name="expenseEmployeeId">
                <NewFilterSelect
                  options={expenseEmployees.map((item) => ({
                    value: item.id,
                    label: item.firstName,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Орлого авах байршил"
                name="incomeWarehouseId"
                rules={[{ required: true, message: "Байршил оруулна уу" }]}
              >
                <NewFilterSelect
                  onSelect={async (value) => {
                    const employees = await getEmployee(value);
                    setIncomeEmployees(employees);
                  }}
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.id,
                    label: warehouse.name,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Орлого авах нярав" name="incomeEmployeeId">
                <NewFilterSelect
                  options={incomeEmployees.map((item) => ({
                    value: item.id,
                    label: item.firstName,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Захиалгын ID" name="bookingId">
                <NewInput disabled />
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
                  <EditableTableMove
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
      <NewModal
        title={"Зөвшөөрсөн захиалгууд"}
        open={isOrderModal}
        width={1050}
        onCancel={() => setIsOrderModal(false)}
        footer={null}
      >
        <Booking
          type={"LOCAL"}
          status={"CONFIRM"}
          params={{ page: 1, limit: 10 }}
          onSelectBooking={(row) => {
            const values = form.getFieldsValue();
            values.documentAt = dayjs();
            values.expenseWarehouseId = row.toWarehouseId;
            values.incomeWarehouseId = row.fromWarehouseId;
            values.bookingId = row.id;
            values.transactions = row.bookingMaterials?.map((item) => ({
              materialId: item.materialId,
              name: item.material?.name,
              measurement: item.material?.measurement.name,
              countPackage: item.material?.countPackage,
              lastQty: item.lastQty,
              unitAmount: 0,
              expenseQty: item.distributeQuantity,
            }));
            setIsOrderModal(false);
            form.setFieldsValue(values);
          }}
        />
      </NewModal>
    </Row>
  );
};
export default TransactionMove;
