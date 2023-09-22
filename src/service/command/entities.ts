import { IDataConsumer } from "../consumer/entities";
import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataBranch } from "../reference/branch/entities";
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
  branchId: number; // Салбар
  branch: IDataBranch;
  consumerId: number; // Харилцагч
  consumer: IDataConsumer;
  quantity: number; // Тоо ширхэг
  prices: IDataPrice[];
  // TODO discounts: Discount[];
  // TODO coupons: Coupon[];
}
export interface IFilterCommand extends IFilter {
  id?: number[];
  commandNo?: string[]; // Тушаалын дугаар
  commandAt?: string[]; // Тушаалын огноо
  ruleAt?: string[]; // Мөрдөж эхлэх огноо
  branchName?: number[]; // Салбар
  consumerName?: string[]; // Харилцагчийн нэр
  consumerCode?: string[]; // Харилцагчийн код
  quantity?: number[]; // Тоо ширхэг
  createdAt?: string; // Үүсгэсэн огноо
}
export interface IParamCommand extends Meta, IParam, IFilterCommand {
  type: CommandType;
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
