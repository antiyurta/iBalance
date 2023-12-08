import { ColumnType, GenericResponse, IData, IFilter, Meta } from "@/service/entities";
import { IDataShoppingCart } from "../shopping-card/entities";
import { IDataMembership } from "@/service/reference/membership/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
export enum GiftType {
  Get = 'GET',
  Income = 'INCOME',
}
export interface IDataGiftCart extends IData {
  id: string;
  membershipId: number;
  membership?: IDataMembership;
  warehouseId: number;
  warehouse?: IDataWarehouse;
  giftAt: string;
  endAt: string;
  quantity: number;
  totalAmount: number;
  shoppingCart: IDataShoppingCart;
}
export interface ICreateGiftCart {
  warehouseId: number;
  membershipId: number;
  giftAt: Date;
  quantity: number;
  endAt: Date;
}
export interface IFilterGiftCart extends IFilter {
  id?: string;
  giftAt?: string;
  warehouseName?: string;
  membershipName?: number;
  membershipDiscount?: number;
  incomeQty?: number;
  expenseQty?: number;
  totalAmount?: number;
}
export type FilteredColumnsGiftCart = {
  [T in keyof IFilterGiftCart]?: ColumnType;
};
export interface IParamGiftCart extends Meta {}
export interface IParamBalanceGift {
  warehouseId?: number;
  giftAt: Date;
  membershipId?: number;
  isAuth?: boolean;
}

export interface IResponseGiftCarts extends GenericResponse {
  response: {
    data: IDataGiftCart[],
    meta: Meta;
  };
}
export interface IResponseBalanceGift extends GenericResponse {
  response: {
    membershipId: number;
    warehouseId: number;
    qty: number;
  }[];
}
export interface IResponseGiftCart extends GenericResponse {
  response: IDataGiftCart;
}
