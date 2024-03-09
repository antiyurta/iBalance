import { Dayjs } from "dayjs";
import { IDataConsumer } from "../consumer/entities";
import { IDataConsumerMembership } from "../consumer/membership/entities";
import { IDataDocument } from "../document/entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataReferencePaymentMethod } from "../reference/payment-method/entities";
import { IDataWarehouse } from "../reference/warehouse/entities";
import { IDataBookingMaterial } from "./booking-material/entities";
/** Захиалгын төлвүүд */
export enum BookingStatus {
  New = "NEW", // Шинэ
  OrderIgnore = "ORDER_IGNORE", // Захиалга цуцалсан
  Distribute = "DISTRIBUTE", // Хуваарилсан
  DistributeIgnore = "DISTRIBUTE_IGNORE", // Хуваарилалт цуцалсан
  Confirm = "CONFIRM", // Олгосон
  ConfirmIgnore = "CONFIRM_IGNORE", // Олголт цуцалсан
}
export interface IDataBooking extends IData {
  id: number;
  code: string;
  consumerId: number;
  consumer?: IDataConsumer;
  paymentMethod?: IDataReferencePaymentMethod;
  fromWarehouseId: number;
  fromWarehouse?: IDataWarehouse;
  toWarehouseId: number;
  toWarehouse?: IDataWarehouse;
  totalAmount: number;
  payAmount: number;
  materialDiscountAmount: number;
  consumerMemebershipId: number;
  consumerMembership?: IDataConsumerMembership;
  consumerDiscountAmount: number;
  discountAmount: number;
  bookingAt: string | Dayjs;
  bookingQuantity: number;
  materialQuantity: number;
  distributeQuantity: number;
  distributeAmount: number;
  confirmQuantity: number;
  confirmAmount: number;
  status: BookingStatus;
  distributeBy: number;
  distributeAt: string;
  confirmBy: number;
  confirmAt: string;
  document?: IDataDocument;
  bookingMaterials?: IDataBookingMaterial[];
}

export interface IFilterBooking extends IColumn {
  id: string;
  bookingAt: string;
  fromWarehouseName: string;
  toWarehouseName: string;
  totalAmount: number;
  count: number;
  materialQuantity: number;
  bookingQuantity: number;
  payAmount: number;
  consumerId: number;
  materialDiscountAmount: number;
  consumerMemebershipId: number;
  consumerDiscountAmount: number;
  discountAmount: number;
  distributeQuantity: number;
  distributeAmount: number;
  confirmQuantity: number;
  confirmAmount: number;
  status: BookingStatus;
  distributeBy: number;
  distributeAt: string;
  confirmBy: number;
  confirmAt: string;
}

export type FilteredColumnsBooking = {
  [T in keyof IFilterBooking]?: ColumnType;
};

export interface IParamBooking extends FilteredColumnsBooking, Meta, IParam {}

export interface IResponseBookings extends GenericResponse {
  response: {
    data: IDataBooking[];
    meta: Meta;
    filter: IFilterBooking;
  };
}

export interface IResponseBooking extends GenericResponse {
  response: IDataBooking;
}
