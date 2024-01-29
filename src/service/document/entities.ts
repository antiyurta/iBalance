import { IDataConsumer } from "@/service/consumer/entities";
import {
  ColumnType,
  DataIndexType,
  DateFilter,
  GenericResponse,
  IColumn,
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
  PosSaleReturn = "POS_SALE_RETURN",
  /** Захиалгын борлуулалт */
  BookingSale = "BOOKING_SALE",
}
/** Гүйлгээний төлвүүд */
export enum DocumentStatus {
  /** Төлөлт гүйцэд хийгдсэн */
  Paid = "PAID",
  /** Төлөлт зээлтэй */
  Lending = "LENDING",
  /** Төлөлт буцаагдсан */
  Refund = "REFUND",
}
export interface IPosDocumentDto {
  regno?: string;
  shoppingCartId: string;
  warehouseId: number;
  posId: number;
  code: string;
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

export interface IFilterDocument extends IColumn {
  id?: number;
  interval?: DateFilter;
  documentCode?: string[];
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
  isLock?: boolean;
  amount?: number[];
  discountAmount?: number[];
  consumerDiscountAmount?: number[];
  membershipDiscountAmount?: number[];
  giftAmount?: number[];
  status?: DocumentStatus;
  payAmount?: number[];
  isEbarimt?: boolean[];
  lockedBy?: number[];
  lockedAt?: string[];
}

export type FilteredColumnsDocument = {
  [T in keyof IFilterDocument]?: ColumnType;
};

export interface IParamDocument extends IParam, IFilterDocument {}

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
const columns: FilteredColumnsDocument = {
  documentCode: {
    label: "Баримтын дугаар",
    isView: true,
    isFiltered: false,
    dataIndex: ["code"],
    type: DataIndexType.MULTI,
  },
  documentAt: {
    label: "Баримтын огноо",
    isView: true,
    isFiltered: false,
    dataIndex: ["documentAt"],
    type: DataIndexType.DATE,
  },
  warehouseName: {
    label: "Байршил",
    isView: true,
    isFiltered: false,
    dataIndex: ["warehouse", "name"],
    type: DataIndexType.MULTI,
  },
  consumerCode: {
    label: "Харилцагчийн код",
    isView: true,
    isFiltered: false,
    dataIndex: ["consumer", "code"],
    type: DataIndexType.MULTI,
  },
  consumerName: {
    label: "Харилцагчийн нэр",
    isView: true,
    isFiltered: false,
    dataIndex: ["consumer", "name"],
    type: DataIndexType.MULTI,
  },
  refundAt: {
    label: "Буцаалт хийх огноо",
    isView: true,
    isFiltered: false,
    dataIndex: ["refundAt"],
    type: DataIndexType.MULTI,
  },
  incomeCount: {
    label: "Орлогын тоо",
    isView: true,
    isFiltered: false,
    dataIndex: ["incomeCount"],
    type: DataIndexType.MULTI,
  },
  incomeQuantity: {
    label: "Орлогын тоо хэмжээ",
    isView: true,
    isFiltered: false,
    dataIndex: ["incomeQuantity"],
    type: DataIndexType.MULTI,
  },
  amount: {
    label: "Төлөх дүн",
    isView: true,
    isFiltered: false,
    dataIndex: ["amount"],
    type: DataIndexType.VALUE,
  },
  discountAmount: {
    label: "Бараа материалын үнийн хөнгөлөлт",
    isView: true,
    isFiltered: false,
    dataIndex: ["discountAmount"],
    type: DataIndexType.VALUE,
  },
  consumerDiscountAmount: {
    label: "Харилцагчийн хөнгөлөлт",
    isView: true,
    isFiltered: false,
    dataIndex: ["consumerDiscountAmount"],
    type: DataIndexType.VALUE,
  },
  payAmount: {
    label: "Төлөх дүн",
    isView: true,
    isFiltered: false,
    dataIndex: ["payAmount"],
    type: DataIndexType.VALUE,
  },
  expenseCount: {
    label: "Зарлагын тоо",
    isView: true,
    isFiltered: false,
    dataIndex: ["expenseCount"],
    type: DataIndexType.MULTI,
  },
  expenseQuantity: {
    label: "Зарлагын тоо хэмжээ",
    isView: true,
    isFiltered: false,
    dataIndex: ["expenseQuantity"],
    type: DataIndexType.MULTI,
  },
  movingStatus: {
    label: "Гүйлгээний цонх",
    isView: true,
    isFiltered: false,
    dataIndex: ["movingStatus"],
    type: DataIndexType.ENUM,
  },
  description: {
    label: "Гүйлгээний утга",
    isView: true,
    isFiltered: true,
    dataIndex: ["description"],
    type: DataIndexType.MULTI,
  },
  isLock: {
    label: "Гүйлгээ түгжсэн эсэх",
    isView: true,
    isFiltered: false,
    dataIndex: ["isLock"],
    type: DataIndexType.BOOLEAN,
  },
  updatedBy: {
    label: "Бүртгэсэн хэрэглэгч",
    isView: false,
    isFiltered: true,
    dataIndex: ["lockedUser", "firstName"],
    type: DataIndexType.USER,
  },
  updatedAt: {
    label: "Бүртгэсэн огноо",
    isView: false,
    isFiltered: true,
    dataIndex: ["updatedAt"],
    type: DataIndexType.DATETIME,
  },
  lockedBy: {
    label: "Түгжсэн хэрэглэгч",
    isView: false,
    isFiltered: true,
    dataIndex: ["lockedUser", "firstName"],
    type: DataIndexType.USER,
  },
  lockedAt: {
    label: "Түгжсэн огноо",
    isView: false,
    isFiltered: true,
    dataIndex: ["lockeddAt"],
    type: DataIndexType.DATETIME,
  },
  // userId = {
  //   label: "Хариуцсан нярав",
  //   isView: true,
  //   isFiltered: false,
  //   dataIndex: ["user", "firstName"],
  //   type: DataIndexType.USER,
  // }; TODO
};
export const getDocumentColumns = (
  movingStatus?: MovingStatus
): FilteredColumnsDocument => {
  const expenseDocument: (keyof FilteredColumnsDocument)[] = [
    "documentCode",
    "documentAt",
    "warehouseName",
    "consumerCode",
    "consumerName",
    "description",
    "expenseCount",
    "expenseQuantity",
    "isLock",
    "updatedBy",
    "updatedAt",
    "lockedBy",
    "lockedAt",
  ];
  const localDocument: (keyof FilteredColumnsDocument)[] = [
    "documentCode",
    "documentAt",
    "warehouseName",
    "description",
    "incomeCount",
    "incomeQuantity",
    "expenseCount",
    "expenseQuantity",
    "isLock",
    "updatedBy",
    "updatedAt",
    "lockedBy",
    "lockedAt",
  ];
  const movingStatusMappings: Record<
    MovingStatus,
    (keyof FilteredColumnsDocument)[]
  > = {
    [MovingStatus.Purchase]: [
      "documentCode",
      "documentAt",
      "warehouseName",
      "consumerCode",
      "consumerName",
      "description",
      "incomeCount",
      "incomeQuantity",
      "isLock",
      "updatedBy",
      "updatedAt",
      "lockedBy",
      "lockedAt",
    ],
    [MovingStatus.SaleReturn]: [
      "documentCode",
      "documentAt",
      "warehouseName",
      "consumerCode",
      "consumerName",
      "refundAt",
      "description",
      "incomeCount",
      "incomeQuantity",
      "isLock",
      "updatedBy",
      "updatedAt",
      "lockedBy",
      "lockedAt",
    ],
    [MovingStatus.Sales]: [
      "documentCode",
      "documentAt",
      "warehouseName",
      "consumerCode",
      "consumerName",
      "description",
      "amount",
      "discountAmount",
      "consumerDiscountAmount",
      "payAmount",
      "expenseCount",
      "expenseQuantity",
      "isLock",
      "updatedBy",
      "updatedAt",
      "lockedBy",
      "lockedAt",
    ],
    [MovingStatus.PurchaseReturn]: expenseDocument,
    [MovingStatus.InOperation]: expenseDocument,
    [MovingStatus.ActAmortization]: expenseDocument,
    [MovingStatus.MovementInWarehouse]: [],
    [MovingStatus.ItemConversion]: localDocument,
    [MovingStatus.Mixture]: localDocument,
    [MovingStatus.Cencus]: localDocument, // TODO тооллогын нярав
    [MovingStatus.Pos]: [],
    [MovingStatus.PosSaleReturn]: [],
    [MovingStatus.BookingSale]: [],
  };
  const keys: (keyof FilteredColumnsDocument)[] = movingStatus
    ? movingStatusMappings[movingStatus]
    : [
        "documentCode",
        "documentAt",
        "warehouseName",
        "consumerCode",
        "consumerName",
        "incomeCount",
        "incomeQuantity",
        "expenseCount",
        "expenseQuantity",
        "isLock",
        "description",
        "movingStatus",
        "updatedBy",
        "updatedAt",
        "lockedBy",
        "lockedAt",
      ];
  const filteredColumns: FilteredColumnsDocument = {};
  if (
    (movingStatus == MovingStatus.Purchase ||
      movingStatus == MovingStatus.PurchaseReturn) &&
    columns.consumerCode &&
    columns.consumerName
  ) {
    columns.consumerCode.label = "Нийлүүлэгчийн код";
    columns.consumerName.label = "Нийлүүлэгчийн нэр";
  }
  if (
    (movingStatus == MovingStatus.SaleReturn ||
      movingStatus == MovingStatus.PurchaseReturn) &&
    columns.description
  ) {
    columns.description.label = "Буцаалтын шалтгаан";
  }
  for (const key of keys) {
    if (columns[key]) {
      filteredColumns[key] = columns[key];
    }
  }
  return filteredColumns;
};
