import { ColumnType, GenericResponse, IFilter, IParam, Meta } from "@/service/entities";
import { IDataPermission } from "../entities";

export interface IDataResource {
  id: number;
  name: string;
  description: string;
  permissions: IDataPermission[];
}

export interface IFilterResource extends IFilter {
  id?: number;
  name?: string;
  description?: string;
}

export type FilteredColumnsResource = {
  [T in keyof IFilterResource]?: ColumnType;
};

export interface IParamResource extends Meta, IParam, IFilterResource {}

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
