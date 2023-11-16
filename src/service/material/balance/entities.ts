import { ColumnType, GenericResponse, Meta } from "@/service/entities";
import { IDataMaterial } from "../entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";

export interface IDataBalance {
  id: number;
  materialId: number; // Барааны id
  material: IDataMaterial; // Барааны мэдээлэл
  quantity: number; // Эхний үлдэгдэл
  warehouseId: number; // барааны байршилийн мэдээлэл
  warehouse: IDataWarehouse; // барааны байршилийн мэдээлэл
  purchaseAt: string;
  expirationAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFilterBalance {
  materialCode?: string[]; // Барааны код
  materialName?: string[]; // Барааны нэр
  materialSectionId?: number[]; // Барааны бүлэг
  materialMeasurementId?: number[]; // Барааны хэмжих нэгж
  materialCountPackage?: number[]; // Багц доторх тоо
  warehouseId?: number[]; // Эхний үлдэгдэл
  quantity?: number[]; // Эхний үлдэгдэл
}

export type FilteredColumnsBalance = {
  [T in keyof IFilterBalance]?: ColumnType;
};

export interface IParamBalance extends IFilterBalance, Meta {}

export interface IResponseBalance extends GenericResponse {
  response: {
    data: IDataBalance[];
    meta: Meta;
    filter: IFilterBalance;
  };
}
