"use client";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import withAuth from "@/feature/hoc/withAuth";
import { authService } from "@/service/authentication/service";
import { App } from "antd";
import Link from "next/link";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { AuthContextProvider } from "@/feature/context/AuthContext";
import Header from "./header";
import { TabsActions } from "@/feature/core/actions/TabsActions";

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
          dispatch(TabsActions.setDefaultTab());
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
    <AuthContextProvider>
      <div className="profile">
        <Header />
        <div className="body">
          <div className="menu">
            <Link className="app-button" href={"/profile/general"}>
              Ерөнхий мэдээлэл
            </Link>
            <Link className="app-button" href={"/profile/change-password"}>
              Нууц үг солих
            </Link>
            <button className="app-button" onClick={() => onFinish()}>
              Гарах
            </button>
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
    </AuthContextProvider>
  );
};
export default withAuth(ProfileLayout);