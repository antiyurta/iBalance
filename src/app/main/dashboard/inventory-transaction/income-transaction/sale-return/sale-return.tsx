import NewCard from "@/components/Card";
import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space } from "antd";
import mnMN from "antd/es/calendar/locale/mn_MN";
import Image from "next/image";
import { EditableTableSaleReturn } from "./editableTableSaleReturn";
import { useEffect, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { ConsumerSelect } from "@/components/consumer-select";
import {
  IDataDocument,
  IParamDocument,
  MovingStatus,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";

export const SaleReturn = () => {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [refundDocuments, setRefundDocuments] = useState<IDataDocument[]>([]);

  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getRefundDocuments = (params: IParamDocument) => {
    DocumentService.get(params).then((response) => {
      if (response.success) {
        setRefundDocuments(response.response.data);
      }
    });
  };
  useEffect(() => {
    getWarehouses({});
    getRefundDocuments({
      movingStatus: MovingStatus.SaleReturn,
    });
  }, []);
  const onFinish = async (values: IDataDocument) => {
    await DocumentService.postRefund(values).then((response) => {
      if (response.success) form.resetFields();
    });
  };
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
                gridTemplateColumns: "repeat(7,1fr)",
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
              <Form.Item label="Харилцагчийн нэр">
                <ConsumerSelect form={form} rules={[]} />
              </Form.Item>
              <Form.Item
                label="Буцаах баримтын дугаар"
                name="refundDocumentId"
                rules={[
                  {
                    required: true,
                    message: "Заавал",
                  },
                ]}
              >
                <NewFilterSelect
                  options={refundDocuments.map((document) => ({
                    value: document.id,
                    label: document.description,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Буцаалт хийх огноо"
                name="refundAt"
                rules={[
                  {
                    required: true,
                    message: "Заавал",
                  },
                ]}
              >
                <NewDatePicker />
              </Form.Item>
              <Form.Item
                label="Буцаалт хийх шалтгаан"
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
                  <EditableTableSaleReturn
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
