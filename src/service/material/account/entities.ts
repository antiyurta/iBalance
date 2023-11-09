import {
  GenericResponse,
  IFilter,
  IFilters,
  IParam,
  Meta,
  ColumnType,
} from "../../entities";

export interface IDataMaterialAccount {
  accountNo: string;
  createdAt: string;
  id: number;
  name: string;
  updatedAt: string;
}

export interface IFilterMaterialAccount extends IFilter {
  accountNo?: string;
  name?: string;
}

export type FilteredColumnsMaterialAccount = {
  [T in keyof IFilterMaterialAccount]?: ColumnType;
};

export interface IParamMaterialAccount extends Meta, IParam, IFilterMaterialAccount {}

export interface IResponseMaterialAccounts extends GenericResponse {
  response: {
    data: IDataMaterialAccount[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IResponseMaterialAccount extends GenericResponse {
  response: IDataMaterialAccount;
}
