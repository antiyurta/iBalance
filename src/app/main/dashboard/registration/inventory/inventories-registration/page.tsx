"use client";

import { MaterialType } from "@/service/material/entities";
import InventoriesRegistration from "./inventoriesRegistration";

const InventoriesRegistrationPage = () => {
  return <InventoriesRegistration ComponentType="FULL" materialType={MaterialType.Material} />;
};
export default InventoriesRegistrationPage;
