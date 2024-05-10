import { ColumnType, GenericResponse, IData, IParam, Meta } from "@/service/entities";
import { IDataCommand, IFilterCommand } from "../entities";
import { IDataMaterial } from "@/service/material/entities";

export interface IDataDiscount extends IData {
  id: number;
  commandId: number;
  command: IDataCommand;
  materialId: number; // Бараа
  material: IDataMaterial;
  endAt: string; // Хөнгөлөлт дуусах огноо
  unitAmount: number; // нэгжийн үнэ
  isPercent: boolean; // Хөнгөлөлт хувь эсэх
  percent: number; // Хөнгөлтийн хувь
  amount: number; // Хөнгөлтийн дүн
  createdBy: number;
  createdAt: string;
}
export interface IFilterDiscount extends IFilterCommand {
  materialCode?: string; // Барааны код
  materialName?: string; // Барааны нэр
  measurementName?: number; // Хэмжих нэгж
  materialSectionName?: number[]; // Бараа материалын бүлэг
  unitAmount?: number; // Нэгжийн үнэ
  endAt?: string; // Хөнгөлөлт дуусах огноо
  percent?: number; // Хөнгөлөлтийн хувь
  amount?: number; // Хөнгөлөлтийн дүн
}
export interface IParamDiscount extends Meta, IParam, IFilterDiscount {}

export type FilteredColumnsDiscount = {
  [T in keyof IFilterDiscount]?: ColumnType;
};

export interface IResponseDiscount extends GenericResponse {
  response: {
    data: IDataDiscount[];
    meta: Meta;
    filter: IFilterCommand;
  };
}
