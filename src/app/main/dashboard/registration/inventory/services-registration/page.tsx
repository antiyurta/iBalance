"use client";

import { MaterialType } from "@/service/material/entities";
import InventoriesGroup from "../inventories-group/inventories-group";
import ServicesRegistration from "./ServicesRegistration";
import { Tabs } from "antd";

const ServicesRegistrationPage = () => {
  const items = [
    {
      label: "Үйлчилгээний бүртгэл",
      key: "item-1",
      children: <ServicesRegistration ComponentType="FULL" type={MaterialType.Service} />,
    },
    {
      label: "Бүлэг",
      key: "item-2",
      children: <InventoriesGroup type={MaterialType.Service} />,
    },
  ];
  return (
    <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
  );
};
export default ServicesRegistrationPage;
