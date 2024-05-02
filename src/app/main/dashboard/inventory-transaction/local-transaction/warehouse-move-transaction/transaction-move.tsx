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
import { hasUniqueValues, openNofi } from "@/feature/common";
import { EmployeeService } from "@/service/employee/service";
import { IDataEmployee } from "@/service/employee/entities";
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import NewModal from "@/components/modal";
import Booking from "../../../ordering-distribution/booking";
import { FormMoveWarehouseDocument } from "@/types/form";
type Props = {
  selectedDocuments?: IDataDocument[];
  onSave?: (state: boolean) => void;
};
const TransactionMove: React.FC<Props> = ({
  selectedDocuments = [],
  onSave,
}) => {
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<FormMoveWarehouseDocument>();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [incomeEmployees, setIncomeEmployees] = useState<IDataEmployee[]>([]);
  const [expenseEmployees, setExpenseEmployees] = useState<IDataEmployee[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOrderModal, setIsOrderModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const incomeDocument = selectedDocuments.find(
    (item) => (item.incomeCount || 0) > 0
  );
  const expenseDocument = selectedDocuments.find(
    (item) => (item.expenseCount || 0) > 0
  );
  const getWarehouses = () => {
    WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: FormMoveWarehouseDocument) => {
    try {
      blockContext.block();
      setIsLoading(true);
      if (isEdit) {
        if (incomeDocument && expenseDocument) {
          const inres = await DocumentService.patch(incomeDocument.id, {
            id: incomeDocument.id,
            movingStatus: MovingStatus.MovementInWarehouse,
            warehouseId: values.incomeWarehouseId,
            documentAt: values.documentAt,
            description: values.description,
            employeeId: values.incomeEmployeeId,
            transactions: values.transactions.map((item) => ({
              materialId: item.materialId,
              incomeQty: item.expenseQty ?? 0,
              expenseQty: 0,
            })),
          });
          const expres = await DocumentService.patch(expenseDocument.id, {
            id: expenseDocument.id,
            movingStatus: MovingStatus.MovementInWarehouse,
            code: expenseDocument.code,
            warehouseId: values.expenseWarehouseId,
            documentAt: values.documentAt,
            description: values.description,
            employeeId: values.expenseEmployeeId,
            transactions: values.transactions.map((item) => ({
              materialId: item.materialId,
              incomeQty: item.expenseQty ?? 0,
              expenseQty: 0,
            })),
          });
          if (inres.success && expres.success) {
            form.resetFields();
          }
        }
      } else {
        const inres = await DocumentService.post({
          id: 1,
          code: values.code,
          warehouseId: values.incomeWarehouseId,
          documentAt: values.documentAt,
          description: values.description,
          employeeId: values.incomeEmployeeId,
          movingStatus: MovingStatus.MovementInWarehouse,
          transactions: values.transactions.map((item) => ({
            materialId: item.materialId,
            incomeQty: item.expenseQty ?? 0,
            expenseQty: 0,
          })),
        });
        const expres = await DocumentService.post({
          id: 1,
          code: values.code,
          warehouseId: values.expenseWarehouseId,
          documentAt: values.documentAt,
          description: values.description,
          employeeId: values.expenseEmployeeId,
          movingStatus: MovingStatus.MovementInWarehouse,
          transactions: values.transactions.map((item) => ({
            materialId: item.materialId,
            expenseQty: item.expenseQty ?? 0,
            incomeQty: 0,
          })),
        });
        if (inres.success && expres.success) {
          form.resetFields();
          generateCode();
        }
      }
      blockContext.unblock();
      setIsLoading(false);
    } catch (error) {
      openNofi("error", String(error));
      blockContext.unblock();
      setIsLoading(false);
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
  const onEdit = () => {
    blockContext.block();
    setIsEdit(true);
    if (incomeDocument && expenseDocument) {
      form.setFieldsValue({
        code: expenseDocument.code,
        documentAt: dayjs(expenseDocument.documentAt),
        description: expenseDocument.description,
        expenseWarehouseId: expenseDocument.warehouseId,
        expenseEmployeeId: expenseDocument.employeeId,
        incomeWarehouseId: incomeDocument.warehouseId,
        incomeEmployeeId: incomeDocument.employeeId,
        bookingId: incomeDocument.bookingId,
        transactions: expenseDocument.transactions.map((transaction) => ({
          materialId: transaction.materialId,
          name: transaction.material?.name,
          measurement: transaction.material?.measurement.name,
          countPackage: transaction.material?.countPackage,
          lastQty: transaction.lastQty,
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
    if (selectedDocuments.length == 0) {
      setIsEdit(false);
    } else {
      onEdit();
      incomeDocument &&
        getEmployee(incomeDocument.warehouseId).then((response) => {
          setIncomeEmployees(response);
        });
      expenseDocument &&
        getEmployee(expenseDocument.warehouseId).then((response) => {
          setExpenseEmployees(response);
        });
    }
  }, [selectedDocuments]);
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
              loading={isLoading}
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
            values.transactions = row.bookingMaterials.map((item) => ({
              materialId: item.materialId,
              name: item.material?.name,
              measurement: item.material?.measurement.name,
              countPackage: item.material?.countPackage,
              lastQty: item.lastQty,
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
