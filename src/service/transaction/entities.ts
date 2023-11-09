import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
  TransactionType,
} from "../entities";
import { IDataMaterial } from "../material/entities";
import { IDataDocument } from "./document/entities";

export interface IDataTransaction extends IData {
  id?: number;
  materialId: number;
  material?: IDataMaterial;
  documentId: number;
  document?: IDataDocument;
  quantity: number;
  price: number;
  endAt: Date;
  type: TransactionType;
}

export interface IFilterTransaction extends IFilter {
  materialId?: number[];
}

export type FilteredColumnsTransaction = {
  [T in keyof IFilterTransaction]?: ColumnType;
};

export interface IParamTransaction extends Meta, IParam, IFilterTransaction {}

export interface IResponseTransactions extends GenericResponse {
  response: {
    data: IDataTransaction[];
    meta: Meta;
    filter: IFilterTransaction;
  };
}
export interface IResponseTransactions extends GenericResponse {
  response: {
    data: IDataTransaction[];
    meta: Meta;
    filter: IFilterTransaction;
  };
}
export interface IResponseTransaction extends GenericResponse {
    response: IDataTransaction;
}