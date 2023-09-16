import { IDataConsumer } from "../consumer/entities";
import {
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../entities";
import { IDataBalanceAccount } from "./account/entities";

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | string[];
  name?: string[];
  amount?: number[];
  sectionId?: number[] | string[];
  updatedAt?: string[];
  updatedBy?: number[];
  queries?: Quearies[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}

export interface IDataInitialBalancePost {
  consumerId: number | undefined;
  accounts?: {
    date: string;
    accountId: number;
    amount: number;
  }[];
}

export interface IDataInitialBalance {
  amount: number;
  consumer: IDataConsumer;
  consumerId: number;
  accounts: IDataBalanceAccount[];
  id: number;
  name: string;
}
export interface IinitialBalanceResponse extends GenericResponse {
  response: {
    data: IDataInitialBalance[];
    meta: Meta;
    filter: IFilters;
  };
}
