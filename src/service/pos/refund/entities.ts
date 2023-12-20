import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataShoppingCart } from "../shopping-card/entities";

export interface ICreatePosRefund {
  shoppingCartId: string;
  description: string;
  amount: number;
}
export interface IParamPosRefund extends Meta {}

export interface IDataPosRefund {
  id: number;
  shoppingCartId: number;
  shoppingCart?: IDataShoppingCart;
  description: string;
  isCash: boolean;
  amount: number;
}
export interface IFilterPosRefund extends IFilter {
  id: number;
  shoppingCartCreatedAt: string;
  shoppingCartId: string;
  warehouseName: string;
  consumerCode: string;
  consumerName: string;
  shoppingCartCounter: number;
  shoppingCartQuantity: number;
  paymentMethodNames: string;
  totalAmount: number;
  materialDiscountAmount: number;
  membershipDiscountAmount: number;
  giftDiscountAmount: number;
  payAmount: number;
  paidAmount: number;
  posName: string;
  taxRegno: string;
  description: string;
}
export type FilteredColumnsPosRefund = {
  [T in keyof IFilterPosRefund]?: ColumnType;
};
export interface IResponsePosRefunds extends GenericResponse {
  response: {
    data: IDataPosRefund[];
    meta: Meta;
  };
}
export interface IResponsePosRefund extends GenericResponse {
  response: IDataPosRefund;
}
