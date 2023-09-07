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

import {
  ColumnType,
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "@/service/entities";
import { IDataLimitOfLoans } from "../entities";

export interface IDataAccount {
  id: number;
  code: string;
  name: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
}

export interface IDataLimitOfLoansAccount {
  id: number;
  code: number;
  account: IDataAccount;
  accountId: number;
  amount: number;
  lendLimitId: number;
  lendLimit: IDataLimitOfLoans;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  deletedAt: string;
  updatedBy: string;
  consumer: string;
  section: string;
  name: string;
  isAccount: string;
  isClose: string;
  isActive: boolean;
}

export type FilteredColumnsLimitOfLoansAccount = {
  [T in keyof IFilters]?: ColumnType;
};

export interface ILimitOfLoansAccountResponse extends GenericResponse {
  response: {
    data: IDataLimitOfLoansAccount[];
    meta: Meta;
    filter: IFilters;
  };
}
