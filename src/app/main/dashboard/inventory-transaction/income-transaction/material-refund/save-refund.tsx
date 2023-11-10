import NewCard from "@/components/Card";
import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space } from "antd";
import mnMN from "antd/es/calendar/locale/mn_MN";
import Image from "next/image";
import { EditableTableRefund } from "./editableTableRefund";
import { useEffect, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { ConsumerSelect } from "@/components/consumer-select";
import {
  IDataReference,
  IParamReference,
  IType,
} from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import { IDataDocument } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";

export const SaveRefund = () => {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [incomeTypes, setIncomeTypes] = useState<IDataReference[]>([]);

  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getIncomeTypes = (params: IParamReference) => {
    ReferenceService.get(params).then((response) => {
      if (response.success) {
        setIncomeTypes(response.response.data);
      }
    });
  };
  useEffect(() => {
    getWarehouses({});
    getIncomeTypes({
      type: IType.MATERIAL_INCOME_TYPE,
    });
  }, []);
  const onFinish = async (values: IDataDocument) => {
    await DocumentService.postIncome(values).then((response) => {
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
            <Row gutter={[12, 12]}>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Баримтын дугаар" name="id">
                  <NewInput disabled />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Огноо" name="date">
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                    disabled
                  />
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
                <Form.Item label="Нийлүүлэгчийн нэр">
                  <ConsumerSelect form={form} rules={[]} />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Гүйлгээний төрөл"
                  name="sectionId"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewFilterSelect
                    options={incomeTypes.map((incomeType) => ({
                      value: incomeType.id,
                      label: incomeType.name,
                    }))}
                  />
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
            <Form.List name="transactions" rules={[]}>
              {(items, { add, remove }, { errors }) => (
                <>
                  <EditableTableRefund
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
