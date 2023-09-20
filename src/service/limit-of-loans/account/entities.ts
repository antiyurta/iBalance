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
  queries?: Queries[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}

import {
  ColumnType,
  GenericResponse,
  IFilters,
  Meta,
  Queries,
  RadioType,
} from "@/service/entities";
import { IDataLimitOfLoans } from "../entities";
import { IDataReferenceAccount } from "@/service/reference/account/entities";


export interface IDataLimitOfLoansAccount {
  id: number;
  code: number;
  account: IDataReferenceAccount;
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
