"use client";
import React, { useContext, useState } from "react";
import { Button, Form, App } from "antd";
import Link from "next/link";
import Image from "next/image";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useTypedSelector, RootState } from "@/feature/store/reducer";
import { authService } from "@/service/authentication/service";
import { useDispatch } from "react-redux";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import { useRouter } from "next/navigation";
import { NewCheckbox, NewInput, NewInputPassword } from "@/components/input";

export interface ILoginData {
  email: string;
  password: string;
}

const Login = () => {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const { remember_me } = useTypedSelector((state: RootState) => state.core);
  const blockContext: BlockView = useContext(BlockContext);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const onFinish = async (values: ILoginData) => {
    blockContext.block();
    await authService
      .authLogin(values)
      .then((response) => {
        if (response.success) {
          dispatch(CoreActions.setLoginData(response));
          dispatch(CoreActions.setRememberMe(values.email));
          dispatch(CoreActions.setLoggedIn(true));
          notification.success({
            message: "Амжилттай нэвтэрлээ",
          });
          setTimeout(() => router.push("/main/profile/general"), 1000);
        }
      })
      .finally(() => blockContext.unblock());
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
            initialValues={{
              email: "ulziikhutag.gurensoft@gmail.com",
              password: "WETITr",
            }}
          >
            <div className="login-control">
              <label htmlFor="email">И-мэйл</label>
              <Form.Item noStyle name="email">
                <NewInput
                  placeholder="example@gmail.com"
                  autoComplete="email"
                />
              </Form.Item>
              <label htmlFor="password">Нууц үг</label>
              <Form.Item noStyle name="password">
                <NewInputPassword placeholder="*********" />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div className="add-ons">
                  <NewCheckbox
                    name="remember_me"
                    checked={isRememberMe}
                    onChange={(e) => setIsRememberMe(e.target.checked)}
                  >
                    Намайг сана
                  </NewCheckbox>
                  <Link href="#">Нууц үг мартсан ?</Link>
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
                <div className="linkRegister">
                  <div className="group">
                    <p> Өөр бүртгэл байхгүй ? </p>
                    <Link href="#">Бүртгүүлэх</Link>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div className="bottom">
        <div className="box">
          <Image
            src={"/icons/facebook.png"}
            loading="eager"
            priority={true}
            alt="facebook"
            width={36}
            height={36}
          />
        </div>
        <div className="box">
          <Image
            src={"/icons/facebook.png"}
            loading="eager"
            priority={true}
            alt="facebook"
            width={36}
            height={36}
          />
        </div>
        <div className="box">
          <Image
            src={"/icons/facebook.png"}
            loading="eager"
            priority={true}
            alt="facebook"
            width={36}
            height={36}
          />
        </div>
      </div>
    </div>
  );
};
export default Login;
