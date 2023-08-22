"use client";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const { isLoggedIn } = useTypedSelector((state: RootState) => state.core);
  if (isLoggedIn) {
    router.push("/profile/general");
  } else {
    router.push("/auth/login");
  }
};
export default HomePage;
