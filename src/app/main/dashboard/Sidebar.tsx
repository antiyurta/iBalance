"use client";

import { Button, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { newTab } from "@/feature/store/slice/tab.slice";
import { PermissionService } from "@/service/permission/service";
import { IMenuItem } from "@/service/permission/entities";
import Image from "next/image";
interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  icon: React.ReactNode;
  children?: MenuItem[];
}
const getMenuItems = (items: IMenuItem[]): MenuItem[] => {
  return items
    .filter((item) => item.isView)
    .map((item) => {
      const menuItem: MenuItem = {
        label: item.label,
        key: item.key,
        icon: item.icon && (
          <Image src={item.icon} width={18} height={18} alt={item.label} />
        ),
      };
      if (item.children && item.children.length > 0) {
        menuItem.children = getMenuItems(item.children);
      }
      return menuItem;
    });
};
const Sidebar = () => {
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  // fuctions
  const filterMenuItem = (keyPath: string[]) => {
    let currentMenu = menuItems.find((item) => item.key === keyPath[0]);
    for (let i = 1; i < keyPath.length; i++) {
      if (!currentMenu || !currentMenu.children) {
        return null;
      }
      currentMenu = currentMenu.children.find(
        (item) => item.key === keyPath[i]
      );
    }
    return currentMenu;
  };
  const menuClick = (keyPath: string[]) => {
    const key = keyPath.reverse();
    const data = filterMenuItem(key);
    dispatch(
      newTab({
        label: data?.label,
        key: key.toString().replaceAll(",", ""),
        closeable: true,
      })
    );
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const getPermission = () => {
    PermissionService.myPermissions().then((response) => {
      if (response.success) {
        const items = getMenuItems(response.response);
        setMenuItems(items);
      }
    });
  };
  useEffect(() => {
    getPermission();
  }, []);
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
        items={menuItems}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};
export default Sidebar;
