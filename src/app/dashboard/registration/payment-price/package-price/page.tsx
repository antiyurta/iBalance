"use client";

import { CommandType } from "@/service/command/entities";
import Price from "../price";

const PackagePricePage = () => {
  return (
    <Price ComponentType="FULL" name="Багц үнэ" type={CommandType.Package} />
  );
};
export default PackagePricePage;
