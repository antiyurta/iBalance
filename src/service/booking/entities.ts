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
  /** Шинэ */
  New = "NEW",
  /** Хуваарилсан */
  Distribute = "DISTRIBUTE",
  /** Олгосон */
  Confirm = "CONFIRM",
  /** Цуцалсан */
  Refund = "REFUND",
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
  bookingAt: number;
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
  code: string;
  consumerId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  totalAmount: number;
  payAmount: number;
  materialDiscountAmount: number;
  consumerMemebershipId: number;
  consumerDiscountAmount: number;
  discountAmount: number;
  bookingAt: number;
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
