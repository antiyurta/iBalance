import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataDocument } from "@/service/document/entities";
import { IDataPaymentInvoice } from "../invoice/entities";
import { IDataPosOpenClose } from "../open-close/entities";
import { IDataGiftCart } from "../gift-cart/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";

export interface CreateShoppingCartDto {
  openCloseId: number;
  goodsIds: number[];
}
export interface UpdateShoppingCartDto {
  consumerMembershipId: number;
  membershipDiscountAmount: number;
}

export interface IDataShoppingCart extends IData {
  id: string;
  currency: string;
  openCloseId: number;
  openClose?: IDataPosOpenClose;
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
  giftAmount: number;
  // goods: IDataShoppingGoods[];
  giftCarts: IDataGiftCart[];
  transactionDocument?: IDataDocument;
  paymentInvoices: IDataPaymentInvoice[];
}
export interface IFilterShoppingCart extends IFilter {
  id?: string;
  isPaid?: boolean;
  openCloseId?: number;
  invoiceType?: PaymentType;
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
export interface IFilterShoppingCartMembership extends IColumn {
  posName: string[];
  documentCode: string[];
  membershipCode: string[];
  membershipName: string[];
  consumerCode: string[];
  consumerName: string[];
  consumerPhone: string[];
  payAmount: number[];
  membershipIncreaseAmount: number[];
  membershipDiscountAmount: number[];
  membershipAmount: number[];
}
export type FilteredColumnsShoppingCartMembership = {
  [T in keyof IFilterShoppingCartMembership]?: ColumnType;
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
