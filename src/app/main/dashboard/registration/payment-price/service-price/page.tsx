"use client";
import Price from "../price";
import { CommandType } from "@/service/command/entities";

const ServicePricePage = () => {
  return (
    <Price
      ComponentType="FULL"
      name="Үйлчилгээний үнэ"
      type={CommandType.Service}
    />
  );
};
export default ServicePricePage;
