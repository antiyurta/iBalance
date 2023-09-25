"use client";

import { CommandType } from "@/service/command/entities";
import Price from "../price";

const DiscountPage = () => {
  return (
    <Price ComponentType="FULL" name="Хөнгөлөлт" type={CommandType.Discount} />
  );
};
export default DiscountPage;
