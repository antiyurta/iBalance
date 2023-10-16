"use client";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { isLoggedIn } = useTypedSelector((state: RootState) => state.core);
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/main/profile/general");
    } else {
      router.push("/auth/login");
    }
  }, [isLoggedIn]);
  return <p>Redirecting...</p>;
};
export default Page;
