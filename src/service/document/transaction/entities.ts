import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../../entities";
import { IDataMaterial } from "../../material/entities";
import { IDataDocument, MovingStatus } from "../entities";

export interface IDataTransaction extends IData {
  id?: number;
  materialId: number;
  material?: IDataMaterial;
  documentId: number;
  document?: IDataDocument;
  quantity: number;
  amount: number;
  discountAmount: number;
  date: Date;
  excessOrDeficiency: number;
}

export interface IFilterTransaction extends IFilter {
  documentId?: number[];
  documentDate?: string[];
  createdAt?: number[];
  warehouseName?: string[];
  materialCode?: string[];
  materialName?: string[];
  materialMeasurementName?: string[];
  quantity?: number[];
  consumerName?: string[];
  description?: string[];
  sectionName?: string[];
  date?: string[];
  movingStatus?: MovingStatus;
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