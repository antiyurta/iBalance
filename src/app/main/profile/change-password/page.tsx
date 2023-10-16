"use client";

import { NewInputPassword } from "@/components/input";
import { Col, Form, Row, Typography } from "antd";

const { Title } = Typography;

const PasswordChange = () => {
  const [form] = Form.useForm();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Title
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#198754",
          padding: "8px 0px",
          borderBottom: "1px solid #E5E6EB",
        }}
      >
        Нууц үг шинэчлэх
      </Title>
      <Row>
        <Col span={12}>
          <Form form={form} layout="vertical">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Form.Item label="Хуучин нууц үг" name="oldPassword">
                <NewInputPassword />
              </Form.Item>
              <Form.Item label="Шинэ нууц үг" name="password">
                <NewInputPassword />
              </Form.Item>
              <Form.Item label="Шинэ нууц үгийг дахин оруулах" name="cpassword">
                <NewInputPassword />
              </Form.Item>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default PasswordChange;
