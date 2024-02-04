import { ColumnType, GenericResponse, IData, IParam, Meta, Operator } from "@/service/entities";
import { IDataCommand, IFilterCommand } from "../entities";
import { IDataMaterial } from "@/service/material/entities";

export interface IDataCoupon extends IData {
  id: number;
  commandId: number;
  command: IDataCommand;
  unitAmount: number; // Нэгжийн үнэ
  materialId: number; // Бараа
  material: IDataMaterial;
  endAt: string; // дуусах огноо
  condition: Operator; // авах нөхцөл
  conditionValue: number; // авах нөхцөл утга
  isPercent: boolean;
  percent: number; // хувиар
  quantity: number; // тоо
  createdBy: number;
  createdAt: string;
}
export interface IFilterCoupon extends IFilterCommand {
  materialCode?: string; // Барааны код
  materialName?: string; // Барааны нэр
  measurementName?: number; // Хэмжих нэгж
  materialSectionName?: number[]; // Бараа материалын бүлэг
  unitAmount?: number; // Нэгжийн үнэ
  endAt?: string; // урамшуулал дуусах огноо
  couponPercent?: number; // урамшуулалын хувь
  couponQuantity?: number; // урамшуулалын тоо
  condition?: Operator; // авах нөхцөл
  conditionValue?: number; // авах нөхцөл утга
}
export interface IParamCoupon extends IParam, IFilterCoupon {}

export type FilteredColumnsCoupon = {
  [T in keyof IFilterCoupon]?: ColumnType;
};

export interface IResponseCoupon extends GenericResponse {
  response: {
    data: IDataCoupon[];
    meta: Meta;
    filter: IFilterCommand;
  };
}
