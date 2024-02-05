import { ColumnType, GenericResponse, IColumn, IFilter, IParam, Meta } from "@/service/entities";
import { IDataPermission } from "../entities";

export interface IDataResource {
  id: number;
  label: string;
  key: string;
  position: number;
  permissions: IDataPermission[];
}

export interface IFilterResource extends IColumn {
  id: number[];
  label: string[];
  key: string[];
  position: number[];
}

export type FilteredColumnsResource = {
  [T in keyof IFilterResource]?: ColumnType;
};

export interface IParamResource extends IParam {}

export interface IResponseResources extends GenericResponse {
  response: {
    data: IDataResource[];
    meta: Meta;
    filter: IFilterResource;
  };
}

export interface IResponseResource extends GenericResponse {
  response: IDataResource;
}
