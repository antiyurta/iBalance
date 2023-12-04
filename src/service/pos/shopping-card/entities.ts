import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataShoppingGoods } from "./goods/entites";
import { IDataDocument } from "@/service/document/entities";
import { IDataPaymentInvoice } from "../invoice/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";

export interface CreateShoppingCartDto {
  goodsIds: number[];
}
export interface UpdateShoppingCartDto {
  consumerMembershipId: number;
  membershipDiscountAmount: number;
}

export interface IDataShoppingCart extends IData {
  id: string;
  currency: string;
  warehouseId: number;
  warehouse: IDataWarehouse;
  taxRegno: string;
  consumerMembershipId: number;
  isPaid: boolean;
  counter: number;
  quantity: number;
  totalAmount: number;
  materialDiscountAmount: number;
  membershipDiscountAmount: number;
  membershipIncreaseAmount: number;
  payAmount: number;
  paidAmount: number;
  goods: IDataShoppingGoods[];
  transactionDocument: IDataDocument;
  paymentInvoices: IDataPaymentInvoice[];
}
export interface IFilterShoppingCart extends IFilter {
  id?: string;
  isPaid?: boolean;
  warehouseName?: string;
  membershipConsumerCode?: number;
  membershipConsumerName?: string;
  counter?: number;
  quantity?: number;
  totalAmount?: number;
  materialDiscountAmount?: number;
  membershipDiscountAmount?: number;
  membershipIncreaseAmount?: number;
  payAmount?: number;
  paidAmount?: number;
  posName?: number;
  taxRegno?: string;
}
export type FilteredColumnsShoppingCart = {
  [T in keyof IFilterShoppingCart]?: ColumnType;
};
export interface IParamShoppingCart extends Meta, IParam, IFilterShoppingCart {}

export interface IResponseShoppingCart extends GenericResponse {
  response: IDataShoppingCart;
}

export interface IResponseShoppingCarts extends GenericResponse {
  response: {
    data: IDataShoppingCart[];
    meta: Meta;
    filter: IFilterShoppingCart;
  };
}
