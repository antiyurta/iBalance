import { ColumnType, GenericResponse, IColumn, IData, IFilter, IParam, Meta } from "@/service/entities";
import { IDataWarehouse } from "../reference/warehouse/entities";
import { IDataEmployee } from "../employee/entities";
export interface ICreatePos {
  warehouseId: number;
  name: string;
  password: string;
  isActive: boolean;
  employeeIds: number[];
}
export interface IDataPos extends IData {
  id: number;
  warehouseId: number;
  warehouse: IDataWarehouse;
  name: string;
  password: string;
  isActive: boolean;
  employees: IDataEmployee[];
}
export interface IFilterPos extends IColumn {
    ids: number[];
    names: string[];
    warehouseCodes: string[];
    warehouseNames: string[];
    warehouseAddress: string[];
    warehouseLogos: string[];
    isActive: string[];
}
export type FilteredColumnsPos = {
  [T in keyof IFilterPos]?: ColumnType;
}
export interface IParamPos extends IParam {
  warehouseId?: number;
  isAuth: boolean;
}

export interface IResponsePos extends GenericResponse {
  response: IDataPos;
}

export interface IResponsePointOfSales extends GenericResponse {
  response: {
    data: IDataPos[];
    meta: Meta;
  };
}
