"use client";

import { NewInputPassword } from "@/components/input";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { IChangePassword } from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { Button, Col, Form, Row, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const PasswordChange = () => {
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const [form] = Form.useForm();
  const router = useRouter();
  const onFinish = (values: IChangePassword) => {
    values.token = accessToken;
    authService.changePassword(values).then((response) => {
      if (response.success) {
        router.push("/auth/login")
      }
    });
  }
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
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Шинэчлэх
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default PasswordChange;
