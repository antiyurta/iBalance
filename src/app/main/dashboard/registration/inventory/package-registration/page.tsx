"use client";

import { MaterialType } from "@/service/material/entities";
import PackageRegistration from "./PackageRegistration";

const PackageRegistrationPage = () => {
  return (
    <PackageRegistration ComponentType="FULL" type={MaterialType.Package} />
  );
};
export default PackageRegistrationPage;
