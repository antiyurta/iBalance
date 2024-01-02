import { IDataConsumer } from "@/service/consumer/entities";
import {
  ColumnType,
  DataIndexType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { IDataTransaction } from "./transaction/entities";
import { IDataReferencePaymentMethod } from "../reference/payment-method/entities";
import { IDataShoppingCart } from "../pos/shopping-card/entities";
import { Dayjs } from "dayjs";
import { IDataPos } from "../pos/entities";

/** Гүйлгээний төлвүүд */
export enum MovingStatus {
  /** Татан авалт/Худалдан авалт */
  Purchase = "PURCHASE",
  /** Борлуулалтын буцаалт */
  SaleReturn = "SALE_RETURN",
  /** Борлуулалт */
  Sales = "SALES",
  /** Худалдан авалтын буцаалт */
  PurchaseReturn = "PURCHASE_RETURN",
  /** Үйл ажиллагаанд */
  InOperation = "IN_OPERATION",
  /** Акт хорогдол */
  ActAmortization = "ACT_AMORTIZATION",
  /** Агуулах доторх хөдөлгөөн */
  MovementInWarehouse = "MOVEMENT_IN_WAREHOUSE",
  /** Барааны хөрвүүлэг */
  ItemConversion = "ITEM_CONVERSION",
  /** Хольц */
  Mixture = "MIXTURE",
  /** Тооллого */
  Cencus = "CENCUS",
  /** Посын борлуулалт */
  Pos = "POS",
  /** Пос борлуулалтын буцаалт */
  PosSaleReturn = 'POS_SALE_RETURN',
  /** Захиалгын борлуулалт */
  BookingSale = "BOOKING_SALE",
}
/** Гүйлгээний төлвүүд */
export enum DocumentStatus {
  /** Төлөлт гүйцэд хийгдсэн */
  Paid = 'PAID',
  /** Төлөлт зээлтэй */
  Lending = 'LENDING',
  /** Төлөлт буцаагдсан */
  Refund = 'REFUND',
}
export interface IPosDocumentDto {
  regno?: string;
  shoppingCartId: string;
  warehouseId: number;
  posId: number;
}
export interface IDataDocument extends IData {
  id: number;
  code: string;
  refundAt: string;
  relDocumentId: number;
  relDocument: IDataDocument;
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
  documentAt: string | Dayjs;
  description: string; // гүйлгээний утга
  paymentMethodIds: number[];
  paymentMethods?: IDataReferencePaymentMethod[]; // Төлбөрийн хэлбэрүүд
  amount: number; // нийт үнэ
  discountAmount: number; // бараа материалын үнийн хөнгөлөлт
  consumerDiscountAmount: number; // харилцагчийн үнийн хөнгөлөлт
  payAmount: number; // төлөх дүн
  movingStatus: MovingStatus;
  isEbarimt: boolean;
  billId?: string;
  macAddress?: string;
  lottery?: string;
  internalCode?: string;
  qrData?: string;
  shoppingCartId: string;
  shoppingCart: IDataShoppingCart;
  status: DocumentStatus;
  posId: number;
  pos?: IDataPos;
  transactions?: IDataTransaction[];
}

export interface IFilterDocument extends IFilter {
  id?: number;
  code?: string;
  movingStatus?: MovingStatus;
  hideMovingStatuses?: MovingStatus[];
  warehouseId?: number;
  consumerId?: number;
  documentAt?: string;
  refundAt?: string;
  relDocumentId?: number[];
  relDocumentWarehouseName?: string[];
  warehouseName?: string[];
  incomeQuantity?: number[];
  incomeCount?: number[];
  expenseCount?: number[];
  expenseQuantity?: number[];
  consumerCode?: string[];
  consumerName?: string[];
  paymentMethodName?: string[];
  bookingId?: number[];
  description?: string[];
  userId?: number[];
  isLock?: boolean;
  amount?: number[];
  discountAmount?: number[];
  consumerDiscountAmount?: number[];
  membershipDiscountAmount?: number[];
  giftAmount?: number[];
  status?: DocumentStatus;
  payAmount?: number[];
  isEbarimt?: boolean[];
}

export type FilteredColumnsDocument = {
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
export interface IResponseDocumentCode extends GenericResponse {
  response: string;
}
export const getDocumentColumns = (
  status?: MovingStatus
): FilteredColumnsDocument => {
  const columns: FilteredColumnsDocument = {
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    documentAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "documentAt",
      type: DataIndexType.DATE,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
  };
  if (
    status != MovingStatus.MovementInWarehouse &&
    status != MovingStatus.ItemConversion &&
    status != MovingStatus.Mixture &&
    status != MovingStatus.Cencus
  ) {
    columns.consumerCode = {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.MULTI,
    };
    columns.consumerName = {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    };
  }
  if (
    status == MovingStatus.Purchase ||
    status == MovingStatus.SaleReturn ||
    status == undefined
  ) {
    if (status == MovingStatus.SaleReturn) {
      columns.refundAt = {
        label: "Буцаалт хийх огноо",
        isView: true,
        isFiltered: false,
        dataIndex: "refundAt",
        type: DataIndexType.MULTI,
      };
    }
    columns.incomeCount = {
      label: "Орлогын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "incomeCount",
      type: DataIndexType.MULTI,
    };
    columns.incomeQuantity = {
      label: "Орлогын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "incomeQuantity",
      type: DataIndexType.MULTI,
    };
  } else if (
    status == MovingStatus.Sales ||
    status == MovingStatus.PurchaseReturn ||
    status == MovingStatus.InOperation ||
    status == MovingStatus.ActAmortization ||
    status == MovingStatus.MovementInWarehouse ||
    status == undefined
  ) {
    if (status == MovingStatus.Sales) {
      columns.paymentMethodName = {
        label: "Төлбөрийн хэлбэр",
        isView: true,
        isFiltered: false,
        dataIndex: ["paymentMethod", "name"],
        type: DataIndexType.MULTI,
      };
      columns.amount = {
        label: "Төлөх дүн",
        isView: true,
        isFiltered: false,
        dataIndex: "amount",
        type: DataIndexType.VALUE,
      };
      columns.discountAmount = {
        label: "Бараа материалын үнийн хөнгөлөлт",
        isView: true,
        isFiltered: false,
        dataIndex: "discountAmount",
        type: DataIndexType.VALUE,
      };
      columns.consumerDiscountAmount = {
        label: "Харилцагчийн хөнгөлөлт",
        isView: true,
        isFiltered: false,
        dataIndex: "consumerDiscountAmount",
        type: DataIndexType.VALUE,
      };
      columns.payAmount = {
        label: "Төлөх дүн",
        isView: true,
        isFiltered: false,
        dataIndex: "payAmount",
        type: DataIndexType.VALUE,
      };
    }
    if (status == MovingStatus.MovementInWarehouse) {
      columns.relDocumentWarehouseName = {
        label: "Орлого авах байршил",
        isView: true,
        isFiltered: false,
        dataIndex: ["relDocument", "warehouse", "name"],
        type: DataIndexType.MULTI,
      };
    }
    columns.expenseCount = {
      label: "Зарлагын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "expenseCount",
      type: DataIndexType.MULTI,
    };
    columns.expenseQuantity = {
      label: "Зарлагын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "expenseQuantity",
      type: DataIndexType.MULTI,
    };
  } else if (status == MovingStatus.Cencus) {
    columns.userId = {
      label: "Хариуцсан нярав",
      isView: true,
      isFiltered: false,
      dataIndex: ["user", "firstName"],
      type: DataIndexType.USER,
    };
  }
  if (status == undefined) {
    columns.movingStatus = {
      label: "Гүйлгээний цонх",
      isView: true,
      isFiltered: false,
      dataIndex: "movingStatus",
      type: DataIndexType.ENUM,
    };
  }
  columns.description = {
    label: "Гүйлгээний утга",
    isView: true,
    isFiltered: true,
    dataIndex: "description",
    type: DataIndexType.MULTI,
  };
  columns.isLock = {
    label: "Гүйлгээ түгжсэн эсэх",
    isView: true,
    isFiltered: false,
    dataIndex: "isLock",
    type: DataIndexType.BOOLEAN,
  };
  columns.createdBy = {
    label: "Бүртгэсэн хэрэглэгч",
    isView: false,
    isFiltered: true,
    dataIndex: ["createdUser", "firstName"],
    type: DataIndexType.USER,
  };
  columns.createdAt = {
    label: "Бүртгэсэн огноо",
    isView: false,
    isFiltered: true,
    dataIndex: "createdAt",
    type: DataIndexType.DATETIME,
  };
  columns.updatedBy = {
    label: "Түгжсэн хэрэглэгч",
    isView: false,
    isFiltered: true,
    dataIndex: ["lockedUser", "firstName"],
    type: DataIndexType.USER,
  };
  columns.updatedAt = {
    label: "Түгжсэн огноо",
    isView: false,
    isFiltered: true,
    dataIndex: "updatedAt",
    type: DataIndexType.DATETIME,
  };
  if (
    status == MovingStatus.Purchase ||
    status == MovingStatus.PurchaseReturn
  ) {
    if (columns.consumerCode) columns.consumerCode.label = "Нийлүүлэгчийн код";
    if (columns.consumerName) columns.consumerName.label = "Нийлүүлэгчийн нэр";
  }
  if (status == MovingStatus.SaleReturn) {
    if (columns.description)
      columns.description.label = "Буцаалт хийх шалтгаан";
  }
  if (status == MovingStatus.MovementInWarehouse) {
    if (columns.warehouseName)
      columns.warehouseName.label = "Зарлага гаргах байршил";
  }
  return columns;
};
