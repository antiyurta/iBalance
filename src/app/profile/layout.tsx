"use client";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { CoreActions } from "@/feature/core/actions/CoreAction";
import withAuth from "@/feature/hoc/withAuth";
import { authService } from "@/service/authentication/service";
import { notification } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";

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
    <div className="profile">
      <div className="header">
        <div className="top"></div>
        <div className="bottom">
          <Image
            src={"/images/sidebar/famale.jpeg"}
            width={180}
            height={180}
            loading="eager"
            alt="profile"
          />
          <div className="info">
            <div className="name">
              <p>asdas</p>
            </div>
            <div className="position">
              <p>asdas</p>
            </div>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="menu">
          <Link href={"/profile/general"}>Ерөнхий мэдээлэл</Link>
          <button className="app-button">Ерөнхий мэдээлэл</button>
          <button className="app-button">asdas</button>
          <button className="app-button">asdas</button>
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
  );
};
export default withAuth(ProfileLayout);
