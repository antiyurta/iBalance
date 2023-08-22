"use client";

import { Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { PathActions } from "@/feature/core/actions/PathAction";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem;
}
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const items = [
    getItem("Хянах самбар", "/dashboard", <MailOutlined />),
    getItem("Үндсэн бүртгэл", "/registration", <AppstoreOutlined />, [
      getItem("Харилцагч", "/customer", null, [
        getItem("Бүртгэл", "/information"),
        getItem("Бүлэг", "/group"),
        getItem("Зээлийн лимит", "7"),
        getItem("Эхний үлдэгдэл", "8"),
        getItem("Авлага дансны бүртгэл", "9"),
      ]),
    ]),
    getItem("Navigation Three", "sub2", <SettingOutlined />, [
      getItem("Option 7", "10"),
      getItem("Option 8", "11"),
      getItem("Option 9", "12"),
      getItem("Option 10", "13"),
    ]),
  ];
  // fuctions
  const fillter = (array: any, key: string) => {
    try {
      return array.find((e: any) => e.key === key);
    } catch (error) {
      return array;
    }
  };
  const menuClick = (keyPath: string[]) => {
    var clonedMenuItems = items;
    keyPath.reverse().map((path) => {
      const data = fillter(clonedMenuItems, path);
      if (data.children) {
        clonedMenuItems = data.children;
      } else {
        dispatch(
          PathActions.setPathData({
            label: data.label,
            path: keyPath,
          })
        );
      }
    });
  };
  return (
    <div className="rightSide">
      <Menu
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          border: "none",
        }}
        onClick={(e) => menuClick(e.keyPath)}
        mode={"inline"}
        theme={"light"}
        items={items}
      />
    </div>
  );
};
export default DashboardLayout;
