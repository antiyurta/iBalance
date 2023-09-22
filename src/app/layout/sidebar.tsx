import LeftSide from "./LeftSide";
import React from "react";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
interface IProps {
  isView: (state: boolean) => void;
}
const Sidebar = (props: IProps) => {
  const { isView } = props;
  const { isLoggedIn } = useTypedSelector((state: RootState) => state.core);
  isView(isLoggedIn);
  if (isLoggedIn) {
    return <LeftSide />;
  }
  return;
};
export default Sidebar;
