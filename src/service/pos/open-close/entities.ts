import {
  ColumnType,
  GenericResponse,
  IColumn,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataPosBankNote } from "./bank-note/entities";
import { IDataShoppingCart } from "../shopping-card/entities";
import { IDataPos } from "../entities";

export interface IOpenDto {
  openerAmount: number;
  posBankNotes: IDataPosBankNote[];
}
export interface ICloseDto {
  cashAmount: number;
  nonCashAmount: number;
  lendAmount: number;
  description: string;
}
export interface IParamOpenClose extends Meta {
  posId?: number;
  openerUserId?: number;
  isClose?: boolean;
}

export interface IDataPosOpenClose {
  id: number;
  posId: number;
  pos?: IDataPos;
  openerUserId: number;
  openerAt: string;
  openerAmount: number;
  isClose: boolean;
  closerUserId: number;
  closerAt: number;
  cashAmount: number;
  nonCashAmount: number;
  lendAmount: number;
  posBankNotes: IDataPosBankNote[];
  shoppingCarts: IDataShoppingCart[];
}
export interface IFilterPosOpenClose extends IColumn {
  id: number;
  posId: number;
  openerUserId: number;
  openerAt: string;
  openerAmount: number;
  isClose: boolean;
  closerUserId: number;
  closerAt: number;
  workingTime: number;
  balanceAmount: number;
  cashAmount: number;
  nonCashAmount: number;
  lendAmount: number;
}
export type FilteredColumnsPosOpenClose = {
  [T in keyof IFilterPosOpenClose]?: ColumnType;
};
export interface IResponsePosOpenClosers extends GenericResponse {
  response: {
    data: IDataPosOpenClose[];
    meta: Meta;
  };
}
export interface IResponsePosOpenClose extends GenericResponse {
  response: IDataPosOpenClose;
}
