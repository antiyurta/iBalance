import { IDataConsumer } from "../entities";
import { IDataBalanceAccount } from "./account/entities";
import { ColumnType, GenericResponse, IParam, Meta } from "@/service/entities";
// Дата харилцагчийн эхний үлдэгдэл
export interface IDataInitialBalance {
  amount: number;
  consumer: IDataConsumer;
  consumerId: number;
  accounts: IDataBalanceAccount[];
  id: number;
  name: string;
}
// Оролт харилцагчийн эхний үлдэгдэл
export interface IInputInitialBalance {
  consumerId: number;
  accounts?: {
    date: string;
    accountId: number;
    amount: number;
  }[];
}
// Хайлт харилцагчийн эхний үлдэгдэл
export interface IFilterInitialBalance {
  code?: string[];
  sectionId?: number[];
  name?: string[];
  amount?: number[];
  updatedBy?: number;
  updatedAt?: string;
}
export type FilteredColumnsInitialBalance = {
  [T in keyof IFilterInitialBalance]?: ColumnType;
};

export interface IParamInitialBalance
  extends IFilterInitialBalance,
    Meta,
    IParam {}

export interface IResponseInitialBalance extends GenericResponse {
  response: {
    data: IDataInitialBalance[];
    meta: Meta;
    filter: IFilterInitialBalance;
  };
}
