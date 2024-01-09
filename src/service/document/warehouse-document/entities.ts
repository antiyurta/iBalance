import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { Dayjs } from "dayjs";
import { IDataTransaction } from "../transaction/entities";

export interface IDataWarehouseDocument extends IData {
  id: number;
  code: string;
  documentAt: string | Dayjs;
  description: string; // гүйлгээний утга
  expenseWarehouseId: number;
  expenseEmployeeId: number;
  incomeWarehouseId: number;
  incomeEmployeeId: number;
  counter: number;
  quantity: number;
  transactions?: IDataTransaction[];
}

export interface IFilterWarehouseDocument extends IFilter {
  id?: number;
  code?: string;
  documentAt?: string | Dayjs;
  expenseWarehouseId?: number[];
  expenseEmployeeId?: number;
  incomeWarehouseId?: number[];
  incomeEmployeeId?: number;
  description?: string; // гүйлгээний утга
  counter?: number;
  quantity?: number;
}

export type FilteredColumnsWarehouseDocument = {
  [T in keyof IFilterWarehouseDocument]?: ColumnType;
};

export interface IParamWarehouseDocument extends Meta, IParam, IFilterWarehouseDocument {}

export interface IResponseDocuments extends GenericResponse {
  response: {
    data: IDataWarehouseDocument[];
    meta: Meta;
    filter: IFilterWarehouseDocument;
  };
}

export interface IResponseDocument extends GenericResponse {
  response: IDataWarehouseDocument;
}
