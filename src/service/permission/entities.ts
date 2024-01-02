import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataRole } from "./role/entities";

export interface IDataPermission {
  id: number;
  roleId: number;
  role?: IDataRole;
  userId: number;
  url: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  isDelete: boolean;
}

export interface IFilterPermission extends IFilter {
  roleId?: number;
  userId?: number;
}

export type FilteredColumnsPermission = {
  [T in keyof IFilterPermission]?: ColumnType;
};

export interface IParamPermission extends Meta, IParam, IFilterPermission {}

export interface IResponsePermissions extends GenericResponse {
  response: {
    data: IDataPermission[];
    meta: Meta;
    filter: IFilterPermission;
  };
}

export interface IResponsePermission extends GenericResponse {
  response: IDataPermission;
}
