import NewCard from "@/components/Card";
import { NewDatePicker, NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space } from "antd";
import mnMN from "antd/es/calendar/locale/mn_MN";
import Image from "next/image";
import { EditableTableIncome } from "./editableTableIncome";
import { useEffect } from "react";

export const SaveIncome = () => {
  const [form] = Form.useForm();
  
  const onFinish = async (values: any) => {};
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
                <Form.Item
                  label="Огноо"
                  name="commandAt"
                  rules={[
                    {
                      required: true,
                      message: "Тушаалын огноо оруулна уу.",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Байршил"
                  name="commandNo"
                  rules={[
                    {
                      required: true,
                      message: "Тушаалын дугаар оруулна уу.",
                    },
                  ]}
                >
                  <NewInput />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Нийлүүлэгчийн нэр"
                  name="ruleAt"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Гүйлгээний төрөл"
                  name="ruleAt"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Гүйлгээний утга"
                  name="ruleAt"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
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
                  <EditableTableIncome
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
