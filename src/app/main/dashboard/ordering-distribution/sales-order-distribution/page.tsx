"use client";
import PageTitle from "@/components/page-title";
import OrderTab from "../order-tab";
import { NextPage } from "next";
const key = "ordering-distribution/sale-order";
const SalePage: NextPage = () => {
  
  return (
    <>
      <PageTitle />
      <OrderTab type="SALE" pageKey={key} />
    </>
  );
};
export default SalePage;
