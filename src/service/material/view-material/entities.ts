import { MaterialType } from "../entities";
import { ColumnType, GenericResponse, IParam, Meta } from "@/service/entities";

export interface IDataViewMaterial {
  id: number;
  type: MaterialType; // төрөл
  code: string; // Дотоод код
  name: string; // Бараа материалын нэр
  barCode: string; // Баркод
  serial: string; // Сериал
  unitCodeName: string; // Нэгдсэн ангиллалын кодын нэр
  measurementName: string; // Хэмжих нэгж нэр
  countPackage: number; // Багц доторх тоо
  sectionName: string; // Бараа материалын бүлэг
  unitAmount: number; // Нэгжийн үнэ
}
export interface IFilterViewMaterial {
  code?: string; // Дотоод код
  name?: string; // Бараа материалын нэр
  barCode?: string; // Баркод
  serial?: string; // Сериал
  unitCodeName?: string; // Нэгдсэн ангиллалын код
  measurementName?: string; // Хэмжих нэгж
  countPackage?: number; // Багц доторх тоо
  sectionName?: string; // Бараа материалын бүлэг
  unitAmount?: number; // Нэгжийн үнэ
}

export type FilteredColumnsViewMaterial = {
  [T in keyof IFilterViewMaterial]?: ColumnType;
};

export interface IParamViewMaterial extends Meta, IParam, IFilterViewMaterial {
  ids?: number[];
  types: MaterialType[]; // Төрөл
}

export interface IResponseViewMaterial extends GenericResponse {
  response: {
    data: IDataViewMaterial[];
    meta: Meta;
  };
}
