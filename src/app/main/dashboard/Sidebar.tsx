"use client";
import { Button, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { newTab } from "@/feature/store/slice/tab.slice";
import { PermissionService } from "@/service/permission/service";
import { IDataPermission } from "@/service/permission/entities";
import Image from "next/image";
import { IDataResource } from "@/service/permission/resource/entities";
import { useResourceContext } from "@/feature/context/ResourceContext";
interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  icon: React.ReactNode;
  children?: MenuItem[];
}
const Sidebar = () => {
  const dispatch = useDispatch();
  const { resources } = useResourceContext();
  const [permissions, setPermissions] = useState<IDataPermission[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  // fuctions
  const getMenuItems = (items: IDataResource[]): MenuItem[] => {
    return items
      .map((item) => {
        const resourceIds = getChildIds(item);
        const menuItem = getView(resourceIds, item);
        if (menuItem && item.resources && item.resources.length > 0) {
          menuItem.children = getMenuItems(item.resources);
        }
        return menuItem;
      })
      .filter((item) => item !== undefined) as MenuItem[];
  };
  function getChildIds(parentResource: IDataResource): number[] {
    const childIds: number[] = [];
    function traverse(resources: IDataResource[] | undefined) {
      if (!resources) return;
      for (const resource of resources) {
        childIds.push(resource.id);
        traverse(resource.resources);
      }
    }
    if (parentResource) {
      childIds.push(parentResource.id);
      traverse(parentResource.resources);
    }
    return childIds;
  }
  const getView = (
    resourceIds: number[],
    resource: IDataResource
  ): MenuItem | undefined => {
    const permission = permissions.find((item) => {
      return item.id && resourceIds.includes(item.resource.id);
    });
    if (permission) {
      const menuItem: MenuItem = {
        label: resource.label,
        key: resource.key,
        icon: resource.icon && (
          <Image
            src={resource.icon}
            width={18}
            height={18}
            alt={resource.label}
          />
        ),
      };
      return menuItem;
    }
  };
  const filterMenu = (keyPath: string[]) => {
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
  const findPermission = (key: React.Key) => {
    return permissions.find((item) => item.resource.key == key);
  };
  const menuClick = (keyPath: string[]) => {
    const key = keyPath.reverse();
    const data = filterMenu(key);
    const permission = data && findPermission(data.key);
    dispatch(
      newTab({
        label: data?.label,
        key: key.toString().replaceAll(",", ""),
        closeable: true,
        breadcrumb: generateBreadcrumbItems(key),
        isAdd: permission?.isAdd,
        isEdit: permission?.isEdit,
        isDelete: permission?.isDelete,
      })
    );
  };
  const generateBreadcrumbItems = (keyPath: string[]): string[] => {
    const breadcrumbItems = [];

    for (let i = 0; i < keyPath.length; i++) {
      const menuItem = filterMenu(keyPath.slice(0, i + 1));
      if (menuItem) {
        breadcrumbItems.push(menuItem.label);
      }
    }
    return breadcrumbItems as string[];
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const getPermission = () => {
    PermissionService.myPermissions().then((response) => {
      if (response.success) {
        setPermissions(response.response);
      }
    });
  };
  useEffect(() => {
    getPermission();
  }, []);
  useEffect(() => {
    setMenuItems(getMenuItems(resources));
  }, [resources, permissions]);
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
          height: "calc(100%, -50px)",
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
