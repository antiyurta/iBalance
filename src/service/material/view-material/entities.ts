import { IDataCoupon } from "@/service/command/coupon/entities";
import { MaterialType } from "../entities";
import { ColumnType, GenericResponse, IParam, Meta } from "@/service/entities";
import { IDataDiscount } from "@/service/command/discount/entities";

export interface IDataViewMaterial {
  discount: any;
  id: number;
  type: MaterialType; // төрөл
  code: string; // Дотоод код
  name: string; // Бараа материалын нэр
  barCode: string; // Баркод
  serial: string; // Сериал
  fileId: number; //zurag id
  unitCodeName: string; // Нэгдсэн ангиллалын кодын нэр
  measurementName: string; // Хэмжих нэгж нэр
  countPackage: number; // Багц доторх тоо
  sectionName: string; // Бараа материалын бүлэг
  coupon: IDataCoupon; // urushuulal
  discountAmount: number; // барааны хөнгөлөлт
  unitAmount: number; // Нэгжийн үнэ
  lastQty: number;
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
  warehouseId?: number; // Агуулахын id
}

export type FilteredColumnsViewMaterial = {
  [T in keyof IFilterViewMaterial]?: ColumnType;
};

export interface IParamViewMaterial extends Meta, IParam, IFilterViewMaterial {
  ids?: number[];
  types: MaterialType[]; // Төрөл
  sectionId?: number;
  consumerId?: number; // Харилцагчийн id
  warehouseId?: number; // Байршлийн id
}

export interface IResponseViewMaterialOne extends GenericResponse {
  response: IDataViewMaterial;
}

export interface IResponseViewMaterial extends GenericResponse {
  response: {
    data: IDataViewMaterial[];
    meta: Meta;
  };
}
