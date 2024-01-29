import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IFilter,
  IFilters,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataLimitOfLoans } from "../entities";
import { IDataReferenceAccount } from "@/service/reference/account/entities";

export interface IDataLimitOfLoansAccount extends IData {
  account: IDataReferenceAccount;
  accountId: number;
  amount: number;
  id: number;
  lendLimitId: number;
  lendLimit: IDataLimitOfLoans;
}

export interface IFilterLimitOfLoansAccount extends IColumn {
  code?: number[];
  name?: string[];
  sectionId?: number[];
  isAccount?: boolean[];
  accountCode?: number[];
  accountName?: string[];
  amount?: number[];
  isClose?: boolean[];
  isActive?: boolean[];
}

export type FilteredColumnsLimitOfLoansAccount = {
  [T in keyof IFilterLimitOfLoansAccount]?: ColumnType;
};

export interface IParamLimitOFloansAccount
  extends IFilterLimitOfLoansAccount,
    IParam {}

export interface ILimitOfLoansAccountResponse extends GenericResponse {
  response: {
    data: IDataLimitOfLoansAccount[];
    meta: Meta;
    filter: IFilterLimitOfLoansAccount;
  };
}
export interface ILimitOfLoansAccountResponseUpdate extends GenericResponse {
  response: IDataLimitOfLoansAccount;
}
