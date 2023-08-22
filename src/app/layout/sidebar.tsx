import LeftSide from "./LeftSide";
import React from "react";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
const Sidebar = () => {
  const { isLoggedIn } = useTypedSelector((state: RootState) => state.core);
  if (isLoggedIn) {
    return <LeftSide />;
  }
  return;
};
export default Sidebar;
