"use client";

import { Button, Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { PathActions } from "@/feature/core/actions/PathAction";
import { useState } from "react";

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
      getItem("Харилцагч", "/customer", <UserOutlined />, [
        getItem("Бүртгэл", "/information"),
        getItem("Бүлэг", "/group"),
        getItem("Авлага дансны бүртгэл", "/receivable-account"),
        getItem("Гишүүнчлэлийн бүртгэл", "/membership-card"),
        getItem("Зээлийн лимит", "/limit-of-loans"),
        getItem("Эхний үлдэгдэл", "/beginning-balance"),
      ]),
      getItem("Бараа материал", "/inventory", <AppstoreOutlined />, [
        getItem("Бүртгэл", "/inventories-registration"),
        getItem("Данс", "/inventories-type"),
        getItem("Бүлэг", "/inventories-group"),
        getItem("Бренд", "/inventories-brand"),
        getItem("Хэмжих нэгж", "/unit-of-measure"),
        getItem("Байршлын бүртгэл", "/storagies-registration"),
        getItem("Эхний үлдэгдэл", "/beginning-balance"),
        getItem("Зохистой нөөцийн хэмжээ", "/stock-of-commodities"),
        getItem("Буцаалтын шалтгаан", "/refund-reason"),
        getItem("Үйлчилгээний бүртгэл", "/services-registration"),
      ]),
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
  //
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  //
  return (
    <div
      style={{
        backgroundColor: "white",
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          display: "flex",
          margin: "auto",
          marginTop: 10,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        style={{
          background: "transparent",
          border: "none",
        }}
        onClick={(e) => menuClick(e.keyPath)}
        mode={"inline"}
        theme={"light"}
        items={items}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};
export default DashboardLayout;
