import { IDataConsumer } from "../consumer/entities";
import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataWarehouse } from "../reference/warehouse/entities";
import { IDataCoupon } from "./coupon/entities";
import { IDataDiscount } from "./discount/entities";
import { IDataPrice } from "./price/entities";
// Үнийн тушаалын төрөл
export enum CommandType {
  Material = "MATERIAL", // Бараа
  Service = "SERVICE", // Үйлчилгээ
  Package = "PACKAGE", // Багц
  Discount = "DISCOUNT", // Хөнгөлөлт
  Coupon = "COUPON", // Урамшуулал
}
export interface IDataCommand extends IData {
  id: number;
  type: CommandType;
  commandNo: string; // Тушаалын дугаар
  commandAt: string; // Тушаалын огноо
  ruleAt: string; // Мөрдөж эхлэх огноо
  warehouseId: number; // Салбар, Байршил
  warehouse: IDataWarehouse;
  consumerId: number; // Харилцагч
  consumer: IDataConsumer;
  quantity: number; // Тоо ширхэг
  isAll: boolean; // Бүгд мөрдөх эсэх
  prices: IDataPrice[];
  discounts: IDataDiscount[];
  coupons: IDataCoupon[];
}
export interface IFilterCommand extends IFilter {
  id?: number[];
  commandNumbers?: string[]; // Тушаалын дугаар
  commandAt?: string[]; // Тушаалын огноо
  ruleAt?: string[]; // Мөрдөж эхлэх огноо
  isAll?: boolean; // Бүгд мөрдөх эсэх
  branchName?: number[]; // Салбар
  consumerName?: string[]; // Харилцагчийн нэр
  consumerCode?: string[]; // Харилцагчийн код
  quantity?: number[]; // Тоо ширхэг
  createdAt?: string; // Үүсгэсэн огноо
}
export interface IParamCommand extends Meta, IParam, IFilterCommand {
  type: CommandType;
  commandNo?: string;
  consumerSectionId?: number;
  createdUserId?: string;
  updatedUserId?: number;
}

export type FilteredColumnsCommand = {
  [T in keyof IFilterCommand]?: ColumnType;
};

export interface IResponseCommand extends GenericResponse {
  response: {
    data: IDataCommand[];
    meta: Meta;
    filter: IFilterCommand;
  };
}

export interface IResponseOneCommand extends GenericResponse {
  response: IDataCommand;
}
