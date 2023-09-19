import {
  ColumnType,
  GenericResponse,
  Meta,
} from "@/service/entities";
import { IDataMaterial } from "../entities";
import { IDataStorageBalance } from "./storage-balance/entites";

export interface IDataBalance {
  id: number;
  materialId: number; // Барааны id
  material: IDataMaterial; // Барааны мэдээлэл
  quantity: number; // Эхний үлдэгдэл
  materialStorageBalances: IDataStorageBalance[]; // барааны байршилийн мэдээлэл
  createdAt: string;
  updatedAt: string;
}

export interface IFilterBalance {
  materialCode?: string[]; // Барааны код
  materialName?: string[]; // Барааны нэр
  materialSectionId?: number[]; // Барааны бүлэг
  materialMeasurementId?: number[]; // Барааны хэмжих нэгж
  materialCountPackage?: number[]; // Багц доторх тоо
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