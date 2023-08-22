"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useAppDispatch, useAppSelector } from "@/feature/redux/hooks";
import { useRouter } from "next/navigation";
import { set } from "@/feature/redux/currentPathSlice";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

function Content({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector((state) => state.currentPathReducer.path);
  const [activeKey, setActiveKey] = useState<string>("/");
  const [items, setItems] = useState<TabsProps["items"]>([
    {
      key: "/",
      label: "Хянах самбар",
      children: children,
      closable: false,
    },
    {
      key: [
        "/basic-registration",
        "/customer",
        "/customer-registration",
      ].toString(),
      label: "Харилцагчийн бүртгэл",
      children: children,
    },
  ]);
  const remove = (targetKey: TargetKey) => {
    const targetIndex = items?.findIndex((pane) => pane.key === targetKey);
    const newPanes = items?.filter((pane) => pane.key !== targetKey);
    if (targetIndex && newPanes?.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
  };
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
  };
  const onChange = (key: string) => {
    const reversedKey = key.split(",").reverse();
    setActiveKey(key);
    dispatch(set(reversedKey));
  };
  useEffect(() => {
    if (currentPath?.length > 0) {
      setActiveKey(currentPath.toString());
      // router.replace(currentPath.join(""));
    }
  }, [currentPath]);
  return (
    <div className="app-main">
      <Tabs
        activeKey={activeKey}
        hideAdd={true}
        onChange={onChange}
        type="editable-card"
        onEdit={onEdit}
        items={items}
      />
    </div>
  );
}
export default Content;
