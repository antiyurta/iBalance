"use client";

import type { ColumnsType } from "antd/es/table";
import OrderDistrubutionIndex, { FormItemType } from "../index";
import { IDataInternal } from "@/service/order-distribution/entities";

const page = () => {
  const columns: ColumnsType<IDataInternal> = [
    {
      title: "Дотоод код",
    },
  ];

  return (
    <OrderDistrubutionIndex
      type="INTERNAL"
      create={{
        grid: 4,
        columns: [
          {
            label: "захиалгын ID",
            type: FormItemType.INPUT,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
        order: [
          {
            label: "захиалгын ID",
            type: FormItemType.ORDER_ID,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
      }}
      distribution={{
        grid: 5,
        columns: [
          {
            label: "захиалгын ID",
            type: FormItemType.INPUT,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
        order: [
          {
            label: "захиалгын ID",
            type: FormItemType.ORDER_ID,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
      }}
      listOfReceipt={{
        grid: 4,
        columns: [
          {
            label: "захиалгын ID",
            type: FormItemType.INPUT,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
        order: [
          {
            label: "захиалгын ID",
            type: FormItemType.ORDER_ID,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
      }}
      listOfTransations={{
        grid: 4,
        columns: [
          {
            label: "захиалгын ID",
            type: FormItemType.INPUT,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
        order: [
          {
            label: "захиалгын ID",
            type: FormItemType.ORDER_ID,
            name: "name",
            disabled: true,
            required: false,
          },
        ],
      }}
    />
  );
};
export default page;
