"use client";

import { CommandType } from "@/service/command/entities";
import Price from "../price";

const CouponPage = () => {
  return (
    <Price ComponentType="FULL" name="Урамшуулал" type={CommandType.Coupon} />
  );
};
export default CouponPage;
