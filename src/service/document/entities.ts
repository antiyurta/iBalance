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
import { IDataReference } from "@/service/reference/entity";
import { IDataTransaction } from "./transaction/entities";
import { IDataReferencePaymentMethod } from "../reference/payment-method/entities";

/** Гүйлгээний төлвүүд */
export enum MovingStatus {
  /** Татан авалт/Худалдан авалт */
  Purchase = 'PURCHASE',
  /** Борлуулалтын буцаалт */
  SaleReturn = 'SALE_RETURN',
  /** Борлуулалт */
  Sales = 'SALES',
  /** Худалдан авалтын буцаалт */
  PurchaseReturn = 'PURCHASE_RETURN',
  /** Үйл ажиллагаанд */
  InOperation = 'IN_OPERATION',
  /** Акт хорогдол */
  ActAmortization = 'ACT_AMORTIZATION',
  /** Агуулах доторх хөдөлгөөн */
  MovementInWarehouse = 'MOVEMENT_IN_WAREHOUSE',
  /** Барааны хөрвүүлэг */
  ItemConversion = 'ITEM_CONVERSION',
  /** Хольц */
  Mixture = 'MIXTURE',
  /** Тооллого */
  Cencus = 'CENCUS',
}
export interface IDataDocument extends IData {
  id?: number;
  refundDocumentId: number;
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
  sectionId: number;
  section: IDataReference; // гүйлгээний төрөл
  date: Date;
  description: string; // гүйлгээний утга
  paymentMethodId: number;
  paymentMethod?: IDataReferencePaymentMethod; // Төлбөрийн хэлбэр
  amount: number; // нийт үнэ
  discountAmount: number; // бараа материалын үнийн хөнгөлөлт
  consumerDiscountAmount: number; // харилцагчийн үнийн хөнгөлөлт
  payAmount: number; // төлөх дүн
  movingStatus: MovingStatus;
  transactions?: IDataTransaction[];
}

export interface IFilterDocument extends IFilter {
  movingStatus: MovingStatus;
  bookingId?: number[];
  warehouseId?: number[];
  isLock?: number[];
}

export type FilteredColumnsDocument = {
  [T in keyof IDataDocument]?: ColumnType;
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
