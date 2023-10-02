"use client";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import withAuth from "@/feature/hoc/withAuth";
import { authService } from "@/service/authentication/service";
import { Upload, notification } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import {
  AuthContext,
  AuthContextProvider,
  useAuthContext,
} from "@/feature/context/AuthContext";
import Header from "./header";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const blockContext: BlockView = useContext(BlockContext);
  const onFinish = async () => {
    blockContext.block();
    await authService
      .authLogout()
      .then((response) => {
        if (response.success) {
          setTimeout(() => router.push("/auth/login"), 1000);
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
