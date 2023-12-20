import { GenericResponse, Operator } from "@/service/entities";
import { IDataShoppingCart } from "../entities";
import { IDataMaterial } from "@/service/material/entities";


export interface CreateGoodsDto {
  materialId: number;
}
export interface UpdateGoodstDto {
  quantity: number;
}
export interface IDataShoppingGoods {
  id: number;
  materialId: number;
  material: IDataMaterial;
  shoppingCartId: number;
  shoppingCart: IDataShoppingCart;
  lastQty: number;
  quantity: number;
  unitAmount: number;
  discountName: string;
  discountAmount: number;
  couponCondition: Operator;
  couponConditionValue: number;
  couponPercent: number;
  couponQty: number;
  payAmount: number;
  totalAmount: number;
  isSale: boolean;
}

export interface IResponseShoppingGoods extends GenericResponse {
  response: IDataShoppingGoods[];
}
export interface IResponseShoppingGood extends GenericResponse {
  response: IDataShoppingGoods;
}
