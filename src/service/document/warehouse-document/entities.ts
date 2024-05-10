import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IParam,
  Meta,
} from "@/service/entities";
import { Dayjs } from "dayjs";
import { IDataTransaction } from "../transaction/entities";

export interface IDataWarehouseDocument extends IData {
  code: string;
  documentAt: string | Dayjs;
  description: string; // гүйлгээний утга
  expenseWarehouseId: number;
  expenseEmployeeId: number;
  incomeWarehouseId: number;
  incomeEmployeeId: number;
  bookingId: string;
  counter: number;
  quantity: number;
  transactions?: IDataTransaction[];
}

export interface IFilterWarehouseDocument extends IColumn {
  id?: number;
  code?: string;
  documentAt?: string | Dayjs;
  expenseWarehouseName?: string[];
  expenseEmployeeFirstName?: string;
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
