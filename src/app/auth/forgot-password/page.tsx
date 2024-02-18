"use client";
import React, { useContext } from "react";
import { Button, Form, App } from "antd";
import Image from "next/image";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {  UserOutlined } from "@ant-design/icons";
import { authService } from "@/service/authentication/service";
import { useRouter } from "next/navigation";
import { NewInput } from "@/components/input";
import { NextPage } from "next";

export interface IForgotPassword {
  email: string;
}
const ForgotPassword: NextPage = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const [loginForm] = Form.useForm<IForgotPassword>();
  const blockContext: BlockView = useContext(BlockContext);
  const onFinish = async (values: IForgotPassword) => {
    blockContext.block();
    await authService.forgotPassword(values.email).then((response) => {
      if (response?.success) {
        notification.success({ message: "И-мэйл хаягаа шалгана уу." });
        router.push("/auth/login");
      }
    }).finally(() => blockContext.unblock());
  };
  return (
    <div className="login-page">
      <div className="top">
        <div className="login-form">
          <p className="title">Нууц үг матсан</p>
          <Form
            form={loginForm}
            layout="vertical"
            onFinish={onFinish}
          >
            <div className="login-control">
              <Form.Item
                label="И-мэйл"
                name="email"
                rules={[{ required: true, message: "И-мэйл оруулна уу." }]}
              >
                <NewInput
                  prefix={<UserOutlined />}
                  placeholder="И-мэйл"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item noStyle>
                <Button htmlType="submit">
                  Хүсэлт илгээх
                  <span>
                    <Image
                      src={"/images/vector.png"}
                      loading="eager"
                      priority={true}
                      alt="arrow"
                      width={20}
                      height={11}
                    />
                  </span>
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
