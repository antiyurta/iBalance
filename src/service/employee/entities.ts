import {
  ColumnType,
  GenericResponse,
  IColumn,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataPermission } from "../permission/entities";
import { IDataRole } from "../permission/role/entities";

type TypeGender = "MAN" | "WOMAN";
/** Ажилтаны төрөл */
export enum EmployeeType {
  NOT_MEDICAL = 0, // Эмнэл зүйн бус
  JOB_POSITION = 1, // Ажлын байр
  MEDICAL = 2, // Эмнэл зүй
}
export interface IDataEmployee {
  id: number;
  registerNumber: string;
  firstName: string;
  lastName: string;
  dateInEmployment: Date;
  dateOutEmployment: Date;
  type: EmployeeType;
  email: string;
  gender: TypeGender;
  homeAddress: string;
  isWorking: boolean;
  phoneNo: string;
  roleId: number;
  warehouseRoleId: number;
  warehouseRole?: IDataRole;
  warehousePermissions: IDataPermission[];
  isTreasure: boolean;
  isCashier: boolean;
}
export interface IFilterEmployee extends IColumn {
  email?: string[];
  phoneNo?: string[];
  registerNumber?: string[];
  firstName?: string[];
  lastName?: string[];
  warehouseRoleName?: string[];
  isTreasure?: boolean[];
  isCashier?: boolean[];
}
export interface IParamEmployee extends IParam {
  warehouseId?: number;
  isTreasure?: boolean;
  isCashier?: boolean;
  isWarehouseRole?: boolean;
}
export type FilteredColumnsEmployee = {
  [T in keyof IFilterEmployee]?: ColumnType;
};
export interface IResponseEmployees extends GenericResponse {
  response: {
    data: IDataEmployee[];
    meta: Meta;
    filter: IFilterEmployee,
  };
}
export interface IResponseEmployee extends GenericResponse {
  response: IDataEmployee;
}
