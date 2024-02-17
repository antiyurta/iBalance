"use client";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import withAuth from "@/feature/hoc/withAuth";
import { authService } from "@/service/authentication/service";
import { App, Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import Header from "./header";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const blockContext: BlockView = useContext(BlockContext);
  const onFinish = async () => {
    blockContext.block();
    await authService
      .authLogout()
      .then((response) => {
        if (response.success) {
          dispatch(CoreActions.setLoginData(Object.create({})));
          dispatch(CoreActions.setLoggedIn(false));
          notification.success({
            message: "Амжилттай гарлаа",
          });
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  return (
    <div className="profile">
      <Header />
      <div className="body">
        <div className="menu">
          <Link className="app-button" href={"/main/profile/general"}>
            Ерөнхий мэдээлэл
          </Link>
          <Link className="app-button" href={"/main/profile/change-password"}>
            Нууц үг солих
          </Link>
          <Button
            type="primary"
            danger
            icon={<PoweroffOutlined />}
            onClick={() => onFinish()}
          >
            Гарах
          </Button>
        </div>
        <div
          style={{
            width: 2,
            height: "100%",
            background: " rgba(232, 234, 238, 0.40)",
          }}
        ></div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
export default withAuth(ProfileLayout);
