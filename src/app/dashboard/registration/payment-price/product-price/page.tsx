"use client";

import { CommandType } from "@/service/command/entities";
import Price from "../price";

const ProductPricePage = () => {
  return <Price ComponentType="FULL" name="Үндсэн үнэ" type={CommandType.Material} />;
};
export default ProductPricePage;
