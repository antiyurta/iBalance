import { GenericResponse } from "../entities";
import { IDataResource } from "./resource/entities";
import { IDataRole } from "./role/entities";
export interface IEmployeePermission {
  warehouseRole: any;
  employeeId: number;
  permissions: IDataPermission[];
  isTreasure: boolean;
  isCashier: boolean;
}
export interface IDataPermission {
  id?: number;
  roleId?: number;
  role?: IDataRole;
  userId?: number;
  resourceId: number;
  resource: IDataResource;
  isAdd?: boolean;
  isView?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
}
export interface IParamPermission {
  roleId?: number;
  employeeId?: number;
  isView?: boolean;
}
export interface IResponsePermissions extends GenericResponse {
  response: IDataPermission[];
}
export interface IResponseMyPermissions extends GenericResponse {
  response: IDataPermission[];
}
