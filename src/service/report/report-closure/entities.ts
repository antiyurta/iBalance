import { DateType } from "@/service/config-code/entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IParam,
  Meta,
} from "../../entities";

export interface IDataReportClosure extends IData {
  id?: number;
  period: DateType;
  year?: number;
  quarter?: number;
  month?: number;
  isClose?: boolean;
}

export interface IColumnReportClosure extends IColumn {
  id: string[];
  period: DateType[];
  year: number[];
  quarter: number[];
  month: number[];
  isClose: boolean[];
}

export type FilteredColumnsReportClosure = {
  [T in keyof IColumnReportClosure]?: ColumnType;
};

export interface IParamReportClosure extends IParam {
  period?: DateType;
}
export interface IResponseReportClosures extends GenericResponse {
  response: {
    data: IDataReportClosure[];
    meta: Meta;
    filter: IColumnReportClosure;
  };
}
export interface IResponseReportClosure extends GenericResponse {
  response: IDataReportClosure;
}
