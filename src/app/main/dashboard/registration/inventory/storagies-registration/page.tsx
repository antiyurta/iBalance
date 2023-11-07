"use client";

import NewDirectoryTree from "@/components/directoryTree";
import StoragiesRegistration from "./StoragiesRegistration";
import { Tabs } from "antd";
import { StoragiesGroup } from "./storage-group";
const StoragiesRegistrationPage = () => {
  const items = [
    {
      label: "Байршлын бүртгэл",
      key: "item-1",
      children: <StoragiesRegistration ComponentType="FULL" />,
    },
    {
      label: "Бүлэг",
      key: "item-2",
      children: <StoragiesGroup />,
    },
  ];
  return (
    <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
  );
};
export default StoragiesRegistrationPage;
