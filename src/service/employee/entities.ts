import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "../entities";
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
  isTreasure: boolean;
  isCashier: boolean;
}
export interface IFilterEmployee extends IFilter {
  email?: string;
  phoneNo?: string;
  registerNumber?: string;
  firstName?: string;
  lastName?: string;
  warehouseRoleId?: number;
  isTreasure?: boolean;
  isCashier?: boolean;
  warehouseId?: number;
}
export interface IParamEmployee extends Meta, IParam, IFilterEmployee {}
export type FilteredColumnsEmployee = {
  [T in keyof IFilterEmployee]?: ColumnType;
};
export interface IResponseEmployees extends GenericResponse {
  response: {
    data: IDataEmployee[];
    meta: Meta;
  };
}
export interface IResponseEmployee extends GenericResponse {
  response: IDataEmployee;
}
