"use client";
import { IDataDocument } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Col, Form, Row, Space, Typography, message } from "antd";
import { useEffect, useState } from "react";
import Image from "next/image";
import NewCard from "@/components/Card";
import {
  NewDatePicker,
  NewFilterSelect,
  NewInput,
  NewInputNumber,
} from "@/components/input";
import mnMN from "antd/es/calendar/locale/mn_MN";
import { ConsumerSelect } from "@/components/consumer-select";
import { EditableTableAction } from "./editableTableAction";
import {
  IDataReferencePaymentMethod,
  IParamPaymentMethod,
} from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";

const TransactionAction = () => {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);

  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataDocument) => {
    await DocumentService.postOperation(values).then((response) => {
      if (response.success) form.resetFields();
    });
  };
  useEffect(() => {
    getWarehouses({});
  }, []);
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
              <Form.Item label="Огноо" name="date">
                <NewDatePicker format={"YYYY-MM-DD"} locale={mnMN} disabled />
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
                  <EditableTableAction
                    data={items}
                    form={form}
                    add={add}
                    remove={remove}
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
export default TransactionAction;
