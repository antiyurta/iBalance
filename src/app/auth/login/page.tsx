"use client";
import React, { useContext, useState } from "react";
import { Button, Form, App } from "antd";
import Link from "next/link";
import Image from "next/image";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { authService } from "@/service/authentication/service";
import { useDispatch } from "react-redux";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import { useRouter } from "next/navigation";
import { NewCheckbox, NewInput, NewInputPassword } from "@/components/input";
import { AppDispatch } from "@/feature/store/store";
import { emptyTabs } from "@/feature/store/slice/tab.slice";

export interface ILoginData {
  email: string;
  password: string;
}

const Login = () => {
  const { notification } = App.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [isRememberMe, setIsRememberMe] = useState(true);
  const onFinish = async (values: ILoginData) => {
    blockContext.block();
    if (isRememberMe) {
      localStorage.setItem("email", values.email);
      localStorage.setItem("password", values.password);
    }
    await authService
      .authLogin(values)
      .then((response) => {
        if (response?.success) {
          dispatch(CoreActions.setLoginData(response));
          dispatch(CoreActions.setRememberMe(values.email));
          dispatch(CoreActions.setLoggedIn(true));
          dispatch(emptyTabs());
          notification.success({
            message: "Амжилттай нэвтэрлээ",
          });
        }
      })
      .finally(() => {
        setTimeout(() => router.push("/main/profile/general"), 1000);
        blockContext.unblock();
      });
  };
  return (
    <div className="login-page">
      <div className="top">
        <div className="login-form">
          <p className="title">Нэвтрэх</p>
          <Form
            form={loginForm}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="on"
            initialValues={{
              email: localStorage.getItem("email"),
              password: localStorage.getItem("password"),
              remember_me: true,
            }}
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
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Нууц үг"
                name="password"
                rules={[{ required: true, message: "Нууц үг оруулна уу." }]}
              >
                <NewInputPassword
                  prefix={<LockOutlined />}
                  placeholder="Нууц үг"
                  size="large"
                />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div className="add-ons">
                  <Form.Item name="remember_me" noStyle>
                    <NewCheckbox
                      checked={isRememberMe}
                      onChange={(e) => setIsRememberMe(e.target.checked)}
                    >
                      Намайг сана
                    </NewCheckbox>
                  </Form.Item>
                  <Link href="/auth/forgot-password">Нууц үг мартсан ?</Link>
                </div>
                <Form.Item noStyle>
                  <Button htmlType="submit">
                    Нэвтрэх
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
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Login;
