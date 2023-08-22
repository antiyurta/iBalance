import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTypedSelector, RootState } from "../store/reducer";
import { Spin } from "antd";

export default function withAuth(Component: React.ComponentType<any>) {
  return function ProtectedRoute({ ...props }: any) {
    const router = useRouter();
    const { isLoggedIn } = useTypedSelector((state: RootState) => state.core);
    useEffect(() => {
      if (!isLoggedIn) {
        router.push("/auth/login");
      }
    }, [isLoggedIn, router]);
    if (isLoggedIn) {
      return <Component {...props} />;
    }
  };
}
