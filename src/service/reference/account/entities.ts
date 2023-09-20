import {
  ColumnType,
  GenericResponse,
  IData,
  IParam,
  Meta,
} from "@/service/entities";

export interface IDataReferenceAccount extends IData {
  id: number;
  code: string;
  name: string;
}
export interface IFilterReferenceAccount {
  code?: string[];
  name?: string[];
  updatedBy?: number[];
}
export type FilteredColumnsAccount = {
  [T in keyof IFilterReferenceAccount]?: ColumnType;
};
export interface IParamReferenceAccount
  extends IFilterReferenceAccount,
    Meta,
    IParam {}

export interface IResponseAccounts extends GenericResponse {
  response: {
    data: IDataReferenceAccount[];
    meta: Meta;
    filter: IFilterReferenceAccount;
  };
}
export interface IResponseAccount extends GenericResponse {
  response: {
    data: IDataReferenceAccount;
    meta: Meta;
    filter: IFilterReferenceAccount;
  };
}
