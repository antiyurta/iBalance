"use client";

import StoragiesRegistration from "./StoragiesRegistration";
import { Tabs } from "antd";
import { StoragiesGroup } from "./storage-group";
import PageTitle from "@/components/page-title";
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
    <>
      <PageTitle onClick={() => {}} />
      <Tabs className="lineTop" items={items} />
    </>
  );
};
export default StoragiesRegistrationPage;
