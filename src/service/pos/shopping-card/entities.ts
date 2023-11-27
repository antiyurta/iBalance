import { IDataCoupon } from "@/service/command/coupon/entities";
import { IDataDiscount } from "@/service/command/discount/entities";
import { GenericResponse, IData, IParam, Meta } from "@/service/entities";
import { IDataMaterial } from "@/service/material/entities";

export interface IDataShoppingCart extends IData {
  id: number;
  amount: number;
  couponId: number;
  coupon: IDataCoupon;
  discountId: number;
  discount: IDataDiscount;
  isSale: boolean;
  materialId: number;
  material: IDataMaterial;
  quantity: number;
  goodsId: number;
  unitAmount: number;
  lastQty: number;
}

export interface IDataShoppingCartPost {
  materialId: number;
  lastQty: number;
  quantity: number;
  amount: number;
  discountId: number;
  couponId: number;
}

export interface IResponseShoppingCart extends GenericResponse {
  response: IDataShoppingCart;
}

export interface IResponseShoppingCarts extends GenericResponse {
  response: IDataShoppingCart[];
}
