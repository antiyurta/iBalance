"use client";

import { MaterialType } from "@/service/material/entities";
import InventoriesGroup from "./inventories-group";

const InventoriesGroupPage = () => {
  return <InventoriesGroup type={MaterialType.Material} />;
};
export default InventoriesGroupPage;
