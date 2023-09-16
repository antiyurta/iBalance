import {
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../../entities";

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
export interface IDataBalanceAccount {
  date: string;
  account: any;
  accountId: number;
  amount: number;
  balanceId: number;
  id: number;
}

export interface IbalanceAccountResponse extends GenericResponse {
  response: {
    data: IDataBalanceAccount[];
    meta: Meta;
    filter: IFilters;
  };
}
