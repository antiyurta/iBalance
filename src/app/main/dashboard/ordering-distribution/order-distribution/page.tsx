"use client";

import type { ColumnsType } from "antd/es/table";
import { IDataInternal } from "@/service/order-distribution/entities";
import PageTitle from "@/components/page-title";
import OrderTab from "../order-tab";
const key = "ordering-distribution/local-order";
const localPage = () => {
  const columns: ColumnsType<IDataInternal> = [
    {
      title: "Дотоод код",
    },
  ];

  return (
    <>
      <PageTitle />
      <OrderTab type="LOCAL" pageKey={key} />
    </>
  );
};
export default localPage;
