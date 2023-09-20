import { IDataReference } from "@/service/reference/entity";
import {
  ColumnType,
  GenericResponse,
  IData,
  IParam,
  Meta,
} from "../../../entities";
import { IDataInitialBalance } from "../entities";
import { IDataReferenceAccount } from "@/service/reference/account/entities";
// Дата харилцагчийн эхний үлдэгдлийн дансны үлдэгдэл
export interface IDataBalanceAccount extends IData {
  id: number;
  balanceId: number;
  balance: IDataInitialBalance;
  accountId: number;
  account: IDataReferenceAccount;
  amount: number;
  date: string;
}
// Хайлт
export interface IFilterBalanceAccount {
  consumerCode?: string[];
  consumerSectionId?: number[];
  consumerName?: string[];
  accountCode?: string[];
  accountName?: string[];
  amount?: number[];
  updatedBy?: number[];
  createdAt?: string[];
  updatedAt?: string[];
}
export type FilteredColumnsBalanceAccount = {
  [T in keyof IFilterBalanceAccount]?: ColumnType;
};

export interface IParamBalanceAccount
  extends IFilterBalanceAccount,
    Meta,
    IParam {}

export interface IResponseBalanceAccount extends GenericResponse {
  response: {
    data: IDataBalanceAccount[];
    meta: Meta;
    filter: IFilterBalanceAccount;
  };
}
