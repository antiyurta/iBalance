import {
  ColumnType,
  GenericResponse,
  IColumn,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataPosBankNote } from "./bank-note/entities";
import { IDataPos } from "../entities";
import { IDataEmployee } from "@/service/employee/entities";
import { IDataMoneyTransaction } from "../money-transaction/entities";

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
export interface IParamOpenClose extends IParam {
  posId?: number;
  openerEmployeeId?: number;
  isClose?: boolean;
}

export interface IDataPosOpenClose {
  id: number;
  posId: number;
  pos?: IDataPos;
  openerEmployeeId: number;
  openerEmployee: IDataEmployee;
  openerAt: string;
  openerAmount: number;
  workingTime: number;
  isClose: boolean;
  closerEmployeeId: number;
  closerAt: string;
  cashAmount: number;
  nonCashAmount: number;
  lendAmount: number;
  balanceAmount: number;
  posBankNotes: IDataPosBankNote[];
  moneyTransactions: IDataMoneyTransaction[];
}
export interface IFilterPosOpenClose extends IColumn {
  id: number[];
  posId: number[];
  openerEmployeeName: number;
  openerAt: string;
  openerAmount: number[];
  isClose: boolean[];
  closerEmployeeName: string[];
  closerAt: number;
  workingTime: number[];
  balanceAmount: number[];
  cashAmount: number[];
  nonCashAmount: number[];
  lendAmount: number[];
}
export type FilteredColumnsPosOpenClose = {
  [T in keyof IFilterPosOpenClose]?: ColumnType;
};
export interface IResponsePosOpenClosers extends GenericResponse {
  response: {
    data: IDataPosOpenClose[];
    meta: Meta;
    filter: IFilterPosOpenClose;
  };
}
export interface IResponsePosOpenClose extends GenericResponse {
  response: IDataPosOpenClose;
}
