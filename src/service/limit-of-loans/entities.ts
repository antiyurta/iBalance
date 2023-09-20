import { IDataConsumer } from "../consumer/entities";
import {
  ColumnType,
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../entities";
import { IDataAccount } from "./account/entities";

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  name?: string[];
  sectionId?: string[] | number[];
  isAccount?: boolean[];
  limitAmount?: number[];
  isClose?: boolean[];
  isActive?: boolean[];
  updatedAt?: string[];
  updatedBy?: number[];
  queries?: Quearies[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}
export interface IDataAccountsPost {
  accountId: number;
  amount: number;
}

export interface IDataLimitOfLoansPost {
  consumerId: number;
  isAccount: boolean;
  isClose: boolean;
  limitAmount: number;
  accounts?: IDataAccountsPost[];
}

export interface IDataLendLimitAccounts {
  account: IDataAccount;
  accountId: number;
  amount: number;
  id: number;
}

export interface IDataLimitOfLoans {
  consumer: IDataConsumer;
  consumerId: number;
  createdAt: string;
  createdBy: number;
  deletedAt: string;
  id: number;
  isAccount: boolean;
  isClose: boolean;
  lendLimitAccounts: IDataLendLimitAccounts[];
  limitAmount: number;
  updatedAt: string;
  updatedBy: string;
}

export type FilteredColumnsLimitOfLoans = {
  [T in keyof IFilters]?: ColumnType;
};

export interface ILimitOfLoansResponse extends GenericResponse {
  response: {
    data: IDataLimitOfLoans[];
    meta: Meta;
    filter: IFilters;
  };
}
