import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataMaterial } from "@/service/material/entities";
import { CommandType, IDataCommand, IFilterCommand } from "../entities";

export interface IDataPrice extends IData {
  id: number;
  commandId: number;
  command: IDataCommand;
  unitAmount: number; // Нэгжийн үнэ
  materialId: number; // Бараа
  material: IDataMaterial;
  branchId: number; // Салбар
  lumpQuantity: number; // Бөөний тоо ширхэг
  lumpAmount: number; // Бөөний үнэ
  createdBy: number;
  createdAt: string;
}
export interface IFilterPrice extends IFilterCommand {
  materialCode?: string; // Барааны код
  materialName?: string; // Барааны нэр
  measurementName?: number; // Хэмжих нэгж
  countPackage?: number[]; // Багц доторх тоо
  materialSectionName?: number[]; // Бараа материалын бүлэг
  unitAmount?: number; // Нэгжийн үнэ
  lumpQuantity?: number; // Бөөний тоо ширхэг
  lumpAmount?: number; // Бөөний үнэ
}
export interface IParamPrice extends Meta, IParam, IFilterPrice {
  type: CommandType;
}

export type FilteredColumnsPrice = {
  [T in keyof IFilterPrice]?: ColumnType;
};

export interface IResponsePrice extends GenericResponse {
  response: {
    data: IDataPrice[];
    meta: Meta;
    filter: IFilterPrice;
  };
}

export interface IResponseOnePrice extends GenericResponse {
  response: IDataPrice;
}
