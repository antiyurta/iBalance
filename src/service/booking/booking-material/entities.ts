import { IDataMaterial } from "@/service/material/entities";
import { IDataBooking } from "../entities";
import { IDataDiscount } from "@/service/command/discount/entities";
import { ColumnType, GenericResponse, IColumn, IData, IParam, Meta } from "@/service/entities";

export interface IDataBookingMaterial extends IData {
  id: number;
  bookingId: number;
  booking?: IDataBooking;
  materialId: number;
  material?: IDataMaterial;
  materialDiscountId: number;
  materialDiscount?: IDataDiscount;
  quantity: number;
  amount: number;
  discountAmount: number;
  distributeQuantity: number;
  confirmQuantity: number;
  confirmAmount: number;
}

export interface IFilterBookingMaterial extends IColumn {
  bookingId: string;
  bookingAt: string;
  toWarehouseName: string;
  fromWarehouseName: string;
  status: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  amount: number;
  discountAmount: number;
  distributeQuantity: number;
  confirmQuantity: number;
  confirmAmount: number;
}

export type FilteredColumnsBookingMaterial = {
  [T in keyof IFilterBookingMaterial]?: ColumnType;
};

export interface IParamBookingMaterial
  extends IFilterBookingMaterial,
    Meta,
    IParam {}
export interface IResponseBookingMaterials extends GenericResponse {
  response: {
    data: IDataBookingMaterial[];
    meta: Meta;
    filter: IFilterBookingMaterial;
  };
}

export interface IResponseBookingMaterial extends GenericResponse {
  response: IDataBookingMaterial;
}
