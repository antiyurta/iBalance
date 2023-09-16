import {
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../entities";

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  name?: string[];
  updatedAt?: string[];
  updatedBy?: number[];
  queries?: Quearies[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}

export interface IDataReceivableAccount {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface IReceivableAccountResponse extends GenericResponse {
  response: {
    data: IDataReceivableAccount[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IReceivableAccountResponseUpdate extends GenericResponse {
  response: IDataReceivableAccount;
}
