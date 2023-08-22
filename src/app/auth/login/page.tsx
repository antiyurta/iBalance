"use client";
import React, { useContext, useState } from "react";
import { Button, Checkbox, Form, Input, notification } from "antd";
import Link from "next/link";
import Image from "next/image";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useTypedSelector, RootState } from "@/feature/store/reducer";
import { authService } from "@/service/authentication/service";
import { useDispatch } from "react-redux";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import { useRouter } from "next/navigation";

export interface ILoginData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const { remember_me } = useTypedSelector((state: RootState) => state.core);
  const blockContext: BlockView = useContext(BlockContext);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const onFinish = async (values: ILoginData) => {
    // blockContext.block();
    await authService
      .authLogin(values)
      .then((response) => {
        dispatch(CoreActions.setLoginData(response));
        dispatch(CoreActions.setRememberMe(values.email));
        dispatch(CoreActions.setLoggedIn(true));
        notification.success({
          message: "Амжилттай нэвтэрлээ",
        });
        setTimeout(() => router.push("/profile/general"), 1000);
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
              <label>И-мэйл</label>
              <Form.Item noStyle name="email">
                <Input placeholder="example@gmail.com" />
              </Form.Item>
              <label>Нууц үг</label>
              <Form.Item noStyle name="password">
                <Input.Password placeholder="********" />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div className="add-ons">
                  {/* <Form.Item noStyle name="remember"></Form.Item> */}
                  <Checkbox
                    checked={isRememberMe}
                    onChange={(e) => setIsRememberMe(e.target.checked)}
                  >
                    Намайг сана
                  </Checkbox>
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
