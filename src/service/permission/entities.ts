import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataResource } from "./resource/entities";
import { IDataRole } from "./role/entities";
export interface IEmployeePermission {
  employeeId: number;
  permissions: IDataPermission[];
}
export interface IDataPermission {
  id?: number;
  roleId?: number;
  role?: IDataRole;
  userId?: number;
  resourceId: number;
  resource: IDataResource;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  isDelete: boolean;
}
export interface IMenuItem {
  label: string;
  key: string;
  icon: string;
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  children?: IMenuItem[];
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
  response: IDataPermission[];
}
export interface IResponseMyPermissions extends GenericResponse {
  response: IMenuItem[];
}
