import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IParam,
  Meta,
} from "@/service/entities";
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
  id: number[];
  name: string[];
  warehouseCode: string[];
  warehouseName: string[];
  warehouseAddress: string[];
  isActive: boolean[];
}
export type FilteredColumnsPos = {
  [T in keyof IFilterPos]?: ColumnType;
};
export interface IParamPos extends IParam {
  warehouseId?: number;
  isAuth?: boolean;
}

export interface IResponsePos extends GenericResponse {
  response: IDataPos;
}

export interface IResponsePointOfSales extends GenericResponse {
  response: {
    data: IDataPos[];
    meta: Meta;
    filter: IFilterPos;
  };
}
/** Худалдаж авах бараа */
export interface IGoods {
  materialId: number;
  materialName: string;
  imageUrl: string;
  sectionName: string;
  unitAmount: number;
  discountAmount: number;
  quantity: number;
  payAmount: number;
  totalAmount: number;
}
/** Түр хадгалах бараа */
export interface ITemp {
  quantity: number;
  counter: number;
  amount: number;
  date: Date;
  goods: IGoods[];
}
