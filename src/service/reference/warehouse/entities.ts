import { IDataEmployee } from "@/service/employee/entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IParam,
  Meta,
} from "../../entities";
import { IDataTreeSection } from "../tree-section/entities";

export interface IDataWarehouse extends IData {
  id: number;
  sectionId: number;
  section?: IDataTreeSection;
  provinceId: number;
  districtId: number;
  employees: IDataEmployee[]; // Хариуцсан нярав
  fileId: number;
  code: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface IFilterWarehouse extends IColumn {
  sectionName?: string[];
  code?: string[];
  name?: string[];
  province?: number[];
  district?: number[];
  employeeName?: string[];
  address?: string[];
  isActive?: boolean[];
  isMain?: boolean[];
}

export type FilteredColumnsWarehouse = {
  [T in keyof IFilterWarehouse]?: ColumnType;
};

export type FilteredColumns = { [T in keyof IFilterWarehouse]?: ColumnType };

export interface IParamWarehouse extends IParam {
  sectionId?: number;
}

export interface IResponseWarehouses extends GenericResponse {
  response: {
    data: IDataWarehouse[];
    meta: Meta;
    filter: IFilterWarehouse;
  };
}
export interface IResponseWarehouse extends GenericResponse {
  response: IDataWarehouse;
}
