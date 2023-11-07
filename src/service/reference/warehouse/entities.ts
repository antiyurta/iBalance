import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../../entities";
import { IDataTreeSection } from "../tree-section/entities";

export interface IDataWarehouse extends IData {
  id: number;
  sectionId: number;
  section: IDataTreeSection;
  provinceId: number;
  districtId: number;
  userId: number; // Хариуцсан нярав
  fileId: number;
  code: string;
  name: string;
  address: string;
  isActive: string;
}

export interface IFilterWarehouse extends IFilter {
  sectionIds?: number[];
  sectionId?: number;
  code?: string[];
  names?: string[];
  provinceId?: number[];
  districtId?: number[];
  userId?: number[];
  address?: string[];
  fileId?: number[];
  isActive?: string[];
}

export type FilteredColumnsWarehouse = {
  [T in keyof IFilterWarehouse]?: ColumnType;
};

export type FilteredColumns = { [T in keyof IFilterWarehouse]?: ColumnType };

export interface IParamWarehouse extends Meta, IParam, IFilterWarehouse {}

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
