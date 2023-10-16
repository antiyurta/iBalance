"use client";

import { Button, Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  WindowsOutlined,
  LockOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { PathActions } from "@/feature/core/actions/PathAction";
import { TitleActions } from "@/feature/core/actions/TitleAction";
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
const Sidebar = () => {
  const dispatch = useDispatch();
  const items = [
    getItem("Хянах самбар", "/main/dashboard", <MailOutlined />),
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
        getItem("Үйлчилгээний бүртгэл", "/services-registration"),
        getItem("Багцын бүртгэл", "/package-registration"),
        getItem("Эхний үлдэгдэл", "/beginning-balance"),
        getItem("Зохистой нөөцийн хэмжээ", "/stock-of-commodities"),
        getItem("Буцаалтын шалтгаан", "/refund-reason"),
      ]),
      getItem("Төлбөр, үнэ", "/payment-price", <AppstoreOutlined />, [
        getItem("Бүртгэл", "/product-price"),
        getItem("Үйлчилгээний үнэ", "/service-price"),
        getItem("Багц үнэ", "/package-price"),
        getItem("Хөнгөлөлт", "/discount"),
        getItem("Урамшуулал", "/coupon"),
        getItem("Төлбөрийн хэлбэр", "/payment-method"),
      ]),
    ]),
    getItem(
      "Захиалга, хуваарилалт",
      "/ordering-distribution",
      <WindowsOutlined />,
      [
        getItem("Борлуулалт", "/sales-order-distribution"),
        getItem("Дотоод", "/order-distribution"),
      ]
    ),
    getItem("Бараа материал", "/inventory-transaction", <WindowsOutlined />, [
      getItem("Бараа материалын жагсаалт", "/jurnal"),
    ]),
    getItem("Төлбөр тооцоо", "/payments", <WindowsOutlined />, [
      getItem("Поссын борлуулалт", "/pos-sales"),
      getItem("Баримтын жагсаалт", "/list-of-receipt"),
    ]),
    getItem(
      "Тайлан үеийн хаалт",
      "/main/dashboard/current-period-close-off",
      <LockOutlined />
    ),
    getItem("Тайлан", "/main/dashboard/reports", <SnippetsOutlined />),
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
    const top = fillter(clonedMenuItems, keyPath[keyPath.length - 1]);
    if (top.label) {
      dispatch(TitleActions.setTitleData({ label: top.label }));
    }
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
export default Sidebar;
