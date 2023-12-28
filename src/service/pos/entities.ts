import { ColumnType, GenericResponse, IData, IFilter, IParam, Meta } from "@/service/entities";
import { IDataWarehouse } from "../reference/warehouse/entities";
export interface ICreatePos {
  warehouseId: number;
  name: string;
  password: string;
  isActive: boolean;
  userIds: number[];
}
export interface IDataPos extends IData {
  id: number;
  warehouseId: number;
  warehouse: IDataWarehouse;
  name: string;
  password: string;
  isActive: boolean;
  posUsers: IDataPosUser[];
}
interface IDataPosUser {
  id: number;
  posId: number;
  pos: IDataPos;
  userId: number;
}
export interface IFilterPos extends IFilter {
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
export interface IParamPos extends Meta, IParam {
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
