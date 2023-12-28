"use client";

import { Button, Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import {
  CalculatorOutlined,
  AreaChartOutlined,
  UserAddOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
// import { PathActions } from "@/feature/core/actions/PathAction";
import { TitleActions } from "@/feature/core/actions/TitleAction";
import { useState } from "react";
import { TabsActions } from "@/feature/core/actions/TabsActions";
import Image from "next/image";

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

{
  /* <Image
        src="/images/menu/dashboard.svg"
        width={20}
        height={20}
        alt="dashboard"
      /> */
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const items = [
    getItem(
      "Хянах самбар",
      "/main/dashboard",
      <AreaChartOutlined
        style={{
          fontSize: 18,
        }}
      />
    ),
    getItem(
      "Үндсэн бүртгэл",
      "/registration",
      <Image
        src="/images/menu/register.svg"
        width={18}
        height={18}
        alt="register"
      />,
      [
        getItem(
          "Харилцагч",
          "/customer",
          <UserAddOutlined
            style={{
              fontSize: 18,
            }}
          />,
          [
            getItem("Бүртгэл", "/information"),
            getItem("Бүлэг", "/group"),
            getItem("Авлага дансны бүртгэл", "/receivable-account"),
            getItem("Гишүүнчлэлийн бүртгэл", "/membership-card"),
            getItem("Зээлийн лимит", "/limit-of-loans"),
            getItem("Эхний үлдэгдэл", "/customer-balance"),
          ]
        ),
        getItem(
          "Бараа материал",
          "/inventory",
          <Image
            src="/images/menu/material.svg"
            width={18}
            height={18}
            alt="material"
          />,
          [
            getItem("Бүртгэл", "/inventories-registration"),
            getItem("Данс", "/inventories-type"),
            getItem("Бүлэг", "/inventories-group"),
            getItem("Брэнд", "/inventories-brand"),
            getItem("Хэмжих нэгж", "/unit-of-measure"),
            getItem("Байршлын бүртгэл", "/storagies-registration"),
            getItem("Үйлчилгээний бүртгэл", "/services-registration"),
            getItem("Багцын бүртгэл", "/package-registration"),
            getItem("Эхний үлдэгдэл", "/beginning-balance"),
            getItem("Зохистой нөөцийн хэмжээ", "/stock-of-commodities"),
            getItem("Буцаалтын шалтгаан", "/refund-reason"),
          ]
        ),
        getItem(
          "Төлбөр, үнэ",
          "/payment-price",
          <Image
            src="/images/menu/price.svg"
            width={18}
            height={18}
            alt="price"
          />,
          [
            getItem("Үндсэн үнэ", "/product-price"),
            getItem("Үйлчилгээний үнэ", "/service-price"),
            getItem("Багц үнэ", "/package-price"),
            getItem("Хөнгөлөлт", "/discount"),
            getItem("Урамшуулал", "/coupon"),
            getItem("Төлбөрийн хэлбэр", "/payment-method"),
          ]
        ),
      ]
    ),
    getItem(
      "Захиалга, хуваарилалт",
      "/ordering-distribution",
      <Image src="/images/menu/order.svg" width={18} height={18} alt="order" />,
      [
        getItem("Борлуулалт", "/sales-order-distribution"),
        getItem("Дотоод", "/order-distribution"),
      ]
    ),
    getItem(
      "Бараа материал",
      "/inventory-transaction",
      <Image
        src="/images/menu/inventory.svg"
        width={18}
        height={18}
        alt="inventory"
      />,
      [
        getItem("Орлогын гүйлгээ", "/income-transaction", <></>, [
          getItem("Бараа материалын орлого", "/material-income"),
          getItem("Буцаалт", "/sale-return"),
        ]),
        getItem("Зарлагын гүйлгээ", "/expense-transaction", <></>, [
          getItem("Борлуулалт", "/sale-transaction"),
          getItem("Худалдан авалтын буцаалт", "/refund-purchase"),
          getItem("Үйл ажиллагаанд", "/action-transaction"),
          getItem("Акт, хорогдол, устгал", "/act-transaction"),
        ]),
        getItem("Дотоод гүйлгээ", "/local-transaction", <></>, [
          getItem("Байршилын хөдөлгөөн", "/warehouse-move-transaction"),
          getItem("Бараа материалын хөрвүүлэг", "/converter"),
          getItem("Бараа материалын хольц", "/mixture"),
          getItem("Тооллого", "/census"),
        ]),
        getItem("Бараа материалын жагсаалт", "/jurnal"),
      ]
    ),
    getItem(
      "Төлбөр тооцоо",
      "/payments",
      <CalculatorOutlined
        style={{
          fontSize: 18,
        }}
      />,
      [
        getItem("Поссын борлуулалт", "/pos-sales"),
        getItem("Баримтын жагсаалт", "/list-of-receipt"),
      ]
    ),
    getItem(
      "Тайлан",
      "/main/dashboard/reports",
      <Image
        src="/images/menu/report.svg"
        width={18}
        height={18}
        alt="report"
      />
    ),
    getItem(
      "Тайлан үеийн хаалт",
      "/main/dashboard/current-period-close-off",
      <LockOutlined
        style={{
          fontSize: 18,
        }}
      />
    ),
    getItem(
      "Админ",
      "/main/dashboard/admin",
      <UserOutlined
        style={{
          fontSize: 18,
        }}
      />,
      [
        getItem("Хэрэглэгчийн бүртгэл", "/users"),
        getItem("Хэрэглэгчийн эрхийн тохиргоо", "/permission"),
        getItem("POS-ын тохиргоо", "/config-pos"),
      ]
    ),
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
          TabsActions.setTabsData({
            label: data.label,
            key: keyPath.toString().replaceAll(",", ""),
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
      <div
        style={{
          padding: 10,
          backgroundColor: "transparent",
        }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            display: "flex",
            margin: "auto",
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <Menu
        style={{
          background: "transparent",
          border: "none",
          overflow: "auto",
          height: 700,
          minWidth: collapsed ? "" : 240,
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
