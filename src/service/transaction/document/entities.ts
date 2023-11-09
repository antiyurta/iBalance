import { IDataConsumer } from "@/service/consumer/entities";
import {
  ColumnType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { IDataTransaction } from "../entities";

export enum MovingStatus {
  Purchase = "PURCHASE", // Татан авалт/Худалдан авалт
  SalesReturn = "SALE_RETURN", // Борлуулалтын буцаалт
  Sales = "SALES", // Борлуулалт
  PurchaseReturn = "PURCHASE_RETURN", // Худалдан авалтын буцаалт
  InOperation = "IN_OPERATION", // Үйл ажиллагаанд
  ActAmortization = "ACT_AMORTIZATION", // Акт хорогдол
  MovementInWarehouse = "MOVEMENT_IN_WAREHOUSE", // Агуулах доторх хөдөлгөөн
  ItemConversion = "ITEM_CONVERSION", // Барааны хөрвүүлэг
}

export interface IDataDocument extends IData {
  id?: number;
  bookingId: number;
  booking?: any; // TODO datag hiih
  warehouseId: number;
  warehouse?: IDataWarehouse;
  isLock: boolean;
  incomeCount: number;
  incomeQuantity: number;
  expenseCount: number;
  expenseQuantity: number;
  consumerId: number;
  consumer?: IDataConsumer;
  movingStatus: MovingStatus;
  transactions?: IDataTransaction[];
}

export interface IFilterDocument extends IFilter {
  bookingId?: number[];
  warehouseId?: number[];
  isLock?: number[];
}

export type FilteredColumnsReference = {
  [T in keyof IFilterDocument]?: ColumnType;
};

export interface IParamDocument extends Meta, IParam, IFilterDocument {}

export interface IResponseDocuments extends GenericResponse {
  response: {
    data: IDataDocument[];
    meta: Meta;
    filter: IFilterDocument;
  };
}

export interface IResponseDocument extends GenericResponse {
  response: IDataDocument;
}
