"use client";
import { IDataDocument } from "@/service/document/entities";
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
import { IParamViewMaterial } from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { MaterialType } from "@/service/material/entities";
import { IParamUser, IUser } from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import { IDataTransaction } from "@/service/document/transaction/entities";
import { hasUniqueValues } from "@/feature/common";
interface IProps {
  selectedDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
}
const TransactionCencus = (props: IProps) => {
  const { selectedDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const warehouseId: number = Form.useWatch("warehouseId", form);

  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getMaterials = async (params: IParamViewMaterial) => {
    form.validateFields(["warehouseId"]).then(async () => {
      await ViewMaterialService.get(params).then((response) => {
        if (response.success) {
          const materials = response.response.data
            .map((response) => ({
              materialId: response.id,
              name: response.name,
              measurement: response.measurementName,
              countPackage: response.countPackage,
              unitAmount: response.unitAmount,
              lastQty: response.lastQty,
            }))
            .filter((item) => item.lastQty !== 0);
          form.setFieldsValue({ transactions: materials });
        }
      });
    });
  };
  const getUsers = async (params: IParamUser) => {
    authService.getAllUsers(params).then((response) => {
      if (response.success) {
        setUsers(response.response);
      }
    });
  };
  const onFinish = async (values: IDataDocument) => {
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
      await DocumentService.postCensus(values)
        .then((response) => {
          if (response.success) form.resetFields();
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getWarehouses({});
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
          unitAmount: transaction.unitAmount,
          lastQty: transaction.lastQty,
          quantity: transaction.lastQty + (transaction.excessOrDeficiency || 0),
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
                  onChange={(id) => {
                    form.resetFields(["userId"]);
                    setUsers([]);
                    const userIds = warehouses.find(
                      (warehouse) => warehouse.id === id
                    )?.userIds;
                    if (userIds) {
                      getUsers({
                        ids: userIds,
                      });
                    }
                    getMaterials({
                      warehouseId,
                      types: [MaterialType.Material],
                    });
                  }}
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.id,
                    label: warehouse.name,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Хариуцсан нярав"
                name="userId"
                rules={[
                  { required: true, message: "Хариуцсан нярав оруулна уу" },
                ]}
              >
                <NewFilterSelect
                  options={users.map((user) => ({
                    value: user.id,
                    label: `${user.lastName}. ${user.firstName}`,
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
              <Form.List name="transactions" rules={[
                {
                  validator: async (_, transactions) => {
                    const arr = Array.isArray(transactions)
                      ? transactions.map((trans: IDataTransaction) => trans.materialId)
                      : [];
                    if (!hasUniqueValues(arr)) {
                      return Promise.reject(
                        new Error("Барааны код давхардсан байна.")
                      );
                    }
                  }
                }
              ]}>
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
