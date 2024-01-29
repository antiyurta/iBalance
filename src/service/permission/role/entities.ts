import { ColumnType, GenericResponse, IParam, Meta } from "@/service/entities";
import { IDataPermission } from "../entities";

export interface IDataRole {
  id?: number;
  name: string;
  description: string;
  permissions: IDataPermission[];
}

export interface IFilterRole {
  name?: string;
  description?: string;
}

export type FilteredColumnsRole = {
  [T in keyof IFilterRole]?: ColumnType;
};

export interface IParamRole extends IParam, IFilterRole {}

export interface IResponseRoles extends GenericResponse {
  response: {
    data: IDataRole[];
    meta: Meta;
    filter: IFilterRole;
  };
}

export interface IResponseRole extends GenericResponse {
  response: IDataRole;
}
