import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../../entities";
import { IDataTreeSection } from "../tree-section/entities";

export interface IDataBranch extends IData {
  id: number;
  sectionId: number;
  code: string;
  name: string;
  provinceId: number;
  districtId: number;
  fileId: number;
  isActive: string;
  section: IDataTreeSection;
}

export interface IFilterBranch extends IFilter {
  sectionId?: number[];
  code?: string[];
  name?: string[];
  provinceId?: number[];
  districtId?: number[];
  fileId?: number[];
  isActive?: string[];
}

export type FilteredColumnsBranch = {
  [T in keyof IFilterBranch]?: ColumnType;
};

export type FilteredColumns = { [T in keyof IFilterBranch]?: ColumnType };

export interface IParamBranch extends Meta, IParam, IFilterBranch {}

export interface IResponseBranch extends GenericResponse {
  response: {
    data: IDataBranch[];
    meta: Meta;
    filter: IFilterBranch;
  };
}
export interface IResponseOneBranch extends GenericResponse {
  response: IDataBranch;
}
