import { ColumnType, GenericResponse, Meta } from "@/service/entities";
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
export interface IFilterResourceSize {
  materialCode?: string[]; // Барааны код
  materialName?: string[]; // Барааны нэр
  materialSectionId?: number[]; // Барааны бүлэг
  materialMeasurementName?: string[]; // Барааны хэмжих нэгж
  materialCountPackage?: number[]; // Багц доторх тоо
  minResourceSize?: number[]; // Багц доторх тоо
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
  };
}
