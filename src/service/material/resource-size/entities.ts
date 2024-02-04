import { ColumnType, GenericResponse, IColumn, Meta } from "@/service/entities";
import { IDataMaterial } from "../entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";

export interface IDataResourceSize {
  id?: number;
  materialId: number;
  material?: IDataMaterial[];
  warehouseId: number;
  warehouse?: IDataWarehouse;
  minResourceSize: number;
  minDownloadSize: number;
  downloadDay: number;
}
export interface IFilterResourceSize extends IColumn {
  code?: string[]; // Барааны код
  name?: string[]; // Барааны нэр
  materialSectionName?: string[]; // Барааны бүлэг
  measurementName?: string[]; // Барааны хэмжих нэгж
  countPackage?: number[]; // Багц доторх тоо
  warehouseName?: string[]; // Байршил
  downloadDay?: number[];
  minResourceSize?: number[]; // Багц доторх тоо
  minDownloadSize?: number[];
}
export type FilteredColumnsResourceSize = {
  [T in keyof IFilterResourceSize]?: ColumnType;
};
export interface IParamResourceSize extends IFilterResourceSize, Meta {}

export interface IResponseResourceSize extends GenericResponse {
  response: IDataResourceSize;
}

export interface IResponseResourceSizes extends GenericResponse {
  response: {
    data: IDataResourceSize[];
    meta: Meta;
    filter: IFilterResourceSize;
  };
}
