import {
  ColumnType,
  DataIndexType,
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "../../entities";
import { IDataMaterial } from "../../material/entities";
import {
  IDataDocument,
  IFilterDocument,
  IParamDocument,
  MovingStatus,
} from "../entities";

export interface IDataTransaction extends IData {
  id?: number;
  materialId?: number;
  material?: IDataMaterial;
  warehouseDocumentId?: number;
  documentId?: number;
  document?: IDataDocument;
  lastQty?: number;
  incomeQty?: number;
  expenseQty?: number;
  unitAmount?: number;
  totalAmount?: number;
  amount?: number;
  discountAmount?: number;
  transactionAt?: string;
  excessOrDeficiency?: number;
  convertMaterialId?: number;
  convertMaterial?: IDataMaterial;
  convertQuantity?: number;
  convertLastQty?: number;
  description?: string;
  refundDocumentId?: number;
}

export interface IFilterTransaction extends IFilterDocument {
  employeeName?: string[];
  materialCode?: string[];
  materialName?: string[];
  materialMeasurementName?: string[];
  materialCountPackage?: string[];
  lastQty?: number[];
  incomeQty?: number[];
  expenseQty?: number[];
  transactionAt?: string;
  unitAmount?: number[];
  totalAmount?: number[];
  convertMaterialName?: string[];
  convertMaterialMeasurementName?: string[];
  convertMaterialCountPackage?: number[];
  convertQuantity?: number[];
  convertLastQty?: number[];
}

export type FilteredColumnsTransaction = {
  [T in keyof IFilterTransaction]?: ColumnType;
};

export interface IParamTransaction extends IParamDocument {}

export interface IResponseTransactions extends GenericResponse {
  response: {
    data: IDataTransaction[];
    meta: Meta;
    filter: IFilterTransaction;
  };
}
export interface IResponseTransactions extends GenericResponse {
  response: {
    data: IDataTransaction[];
    meta: Meta;
    filter: IFilterTransaction;
  };
}
export interface IResponseTransaction extends GenericResponse {
  response: IDataTransaction;
}
const columns: FilteredColumnsTransaction = {
  code: {
    label: "Баримтын дугаар",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "code"],
    type: DataIndexType.MULTI,
  },
  documentAt: {
    label: "Баримтын огноо",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "documentAt"],
    type: DataIndexType.DATE,
  },
  warehouseName: {
    label: "Байршил",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "warehouse", "name"],
    type: DataIndexType.MULTI,
  },
  employeeName: {
    label: "Хариуцсан нярав",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "employee", "firstName"],
    type: DataIndexType.MULTI,
  },
  materialCode: {
    label: "Дотоод код",
    isView: true,
    isFiltered: false,
    dataIndex: ["material", "code"],
    type: DataIndexType.MULTI,
  },
  materialName: {
    label: "Бараа материалын нэр",
    isView: true,
    isFiltered: false,
    dataIndex: ["material", "name"],
    type: DataIndexType.MULTI,
  },
  materialMeasurementName: {
    label: "Хэмжих нэгж",
    isView: true,
    isFiltered: false,
    dataIndex: ["material", "measurement", "name"],
    type: DataIndexType.MULTI,
  },
  materialCountPackage: {
    label: "Багцын тоо",
    isView: true,
    isFiltered: false,
    dataIndex: ["material", "countPackage"],
    type: DataIndexType.MULTI,
  },
  lastQty: {
    label: "Агуулахын үлдэгдэл",
    isView: true,
    isFiltered: false,
    dataIndex: ["lastQty"],
    type: DataIndexType.VALUE,
  },
  incomeQty: {
    label: "Орлогын тоо хэмжээ",
    isView: true,
    isFiltered: false,
    dataIndex: ["incomeQty"],
    type: DataIndexType.MULTI,
    isSummary: true,
  },
  consumerCode: {
    label: "Харилцагчийн код",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "consumer", "code"],
    type: DataIndexType.MULTI,
  },
  consumerName: {
    label: "Харилцагчийн нэр",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "consumer", "name"],
    type: DataIndexType.MULTI,
  },
  description: {
    label: "Гүйлгээний утга",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "description"],
    type: DataIndexType.MULTI,
  },
  isLock: {
    label: "Гүйлгээ түгжсэн эсэх",
    isView: true,
    isFiltered: false,
    dataIndex: ["document", "isLock"],
    type: DataIndexType.BOOLEAN,
  },
  transactionAt: {
    label: "Дуусах хугацаа",
    isView: true,
    isFiltered: false,
    dataIndex: ["transactionAt"],
    type: DataIndexType.DATE,
  },
  unitAmount: {
    label: "Нэгжийн үнэ",
    isView: true,
    isFiltered: false,
    dataIndex: ["unitAmount"],
    type: DataIndexType.VALUE,
  },
  totalAmount: {
    label: "Нийт дүн",
    isView: true,
    isFiltered: false,
    dataIndex: ["totalAmount"],
    type: DataIndexType.VALUE,
  },
  expenseQty: {
    label: "Зарлагын тоо хэмжээ",
    isView: true,
    isFiltered: false,
    dataIndex: ["expenseQty"],
    type: DataIndexType.MULTI,
    isSummary: true,
  },
  convertMaterialName: {
    label: "Хөрвүүлсэн барааны нэр",
    isView: true,
    isFiltered: true,
    dataIndex: ["convertMaterial", "name"],
    type: DataIndexType.MULTI,
  },
  convertMaterialMeasurementName: {
    label: "Хөрвүүлсэн барааны хэмжих нэгж",
    isView: true,
    isFiltered: true,
    dataIndex: ["convertMaterial", "measurement", "name"],
    type: DataIndexType.MULTI,
  },
  convertMaterialCountPackage: {
    label: "Хөрвүүлсэн барааны багц доторх тоо",
    isView: true,
    isFiltered: true,
    dataIndex: ["convertMaterial", "countPackage"],
    type: DataIndexType.MULTI,
  },
  convertLastQty: {
    label: "Хөрвүүлсэн барааны эцсийн үлдэгдэл",
    isView: true,
    isFiltered: true,
    dataIndex: ["convertLastQty"],
    type: DataIndexType.MULTI,
  },
  convertQuantity: {
    label: "Хөрвүүлсэн барааны тоо ширхэг",
    isView: true,
    isFiltered: true,
    dataIndex: ["convertQuantity"],
    type: DataIndexType.NUMBER,
    isSummary: true,
  },
  createdBy: {
    label: "Бүртгэсэн хэрэглэгч",
    isView: false,
    isFiltered: true,
    dataIndex: ["createdUser", "firstName"],
    type: DataIndexType.USER,
  },
  createdAt: {
    label: "Бүртгэсэн огноо",
    isView: false,
    isFiltered: true,
    dataIndex: ["createdAt"],
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
    dataIndex: ["document", "lockedAt"],
    type: DataIndexType.DATETIME,
  },
  movingStatus: {
    label: "Гүйлгээний цонх",
    isView: true,
    isFiltered: true,
    dataIndex: ["document", "movingStatus"],
    type: DataIndexType.ENUM,
  },
};
export const getTransactionColumns = (
  movingStatus?: MovingStatus
): FilteredColumnsTransaction => {
  const expenseTransaction: (keyof FilteredColumnsTransaction)[] = [
    "code",
    "documentAt",
    "warehouseName",
    "consumerCode",
    "consumerName",
    "materialCode",
    "materialName",
    "materialMeasurementName",
    "materialCountPackage",
    "unitAmount",
    "expenseQty",
    "isLock",
    "description",
    "createdBy",
    "createdAt",
    "lockedBy",
    "lockedAt",
  ];
  const incomeTransaction: (keyof FilteredColumnsTransaction)[] = [
    "code",
    "documentAt",
    "warehouseName",
    "consumerCode",
    "consumerName",
    "description",
    "materialCode",
    "incomeQty",
    "transactionAt",
    "isLock",
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt",
  ];
  const localTransaction: (keyof FilteredColumnsTransaction)[] = [
    "code",
    "documentAt",
    "warehouseName",
    "consumerCode",
    "consumerName",
    "materialCode",
    "materialName",
    "materialMeasurementName",
    "materialCountPackage",
    "incomeQty",
    "expenseQty",
    "isLock",
    "description",
    "createdBy",
    "createdAt",
    "lockedBy",
    "lockedAt",
  ];
  const movingStatusMappings: Record<
    MovingStatus,
    (keyof FilteredColumnsTransaction)[]
  > = {
    [MovingStatus.Purchase]: incomeTransaction,
    [MovingStatus.SaleReturn]: incomeTransaction,
    [MovingStatus.Sales]: [
      "code",
      "documentAt",
      "warehouseName",
      "consumerCode",
      "consumerName",
      "description",
      "materialCode",
      "materialName",
      "materialMeasurementName",
      "materialCountPackage",
      "lastQty",
      "unitAmount",
      "expenseQty",
      "totalAmount",
      "createdBy",
      "createdAt",
      "updatedBy",
      "updatedAt",
    ],
    [MovingStatus.PurchaseReturn]: [
      "code",
      "documentAt",
      "warehouseName",
      "consumerCode",
      "consumerName",
      "description",
      "materialCode",
      "materialName",
      "materialMeasurementName",
      "materialCountPackage",
      "lastQty",
      "expenseQty",
      "transactionAt",
      "isLock",
      "createdBy",
      "createdAt",
      "lockedBy",
      "lockedAt",
    ],
    [MovingStatus.InOperation]: expenseTransaction,
    [MovingStatus.ActAmortization]: expenseTransaction,
    [MovingStatus.MovementInWarehouse]: [
      "code",
      "documentAt",
      "warehouseName",
      "employeeName",
      "materialCode",
      "materialMeasurementName",
      "materialCountPackage",
      "incomeQty",
      "expenseQty",
      "isLock",
      "description",
      "createdBy",
      "createdAt",
      "lockedBy",
      "lockedAt",
    ],
    [MovingStatus.ItemConversion]: localTransaction,
    [MovingStatus.Mixture]: localTransaction,
    [MovingStatus.Cencus]: localTransaction,
    [MovingStatus.Pos]: [],
    [MovingStatus.PosSaleReturn]: [],
    [MovingStatus.BookingSale]: [],
  };
  if (
    (movingStatus == MovingStatus.Purchase ||
      movingStatus == MovingStatus.PurchaseReturn) &&
    columns.consumerCode &&
    columns.consumerName
  ) {
    columns.consumerCode.label = "Нийлүүлэгчийн код";
    columns.consumerName.label = "Нийлүүлэгчийн нэр";
  }
  const keys: (keyof FilteredColumnsTransaction)[] = movingStatus
    ? movingStatusMappings[movingStatus]
    : [
        "code",
        "documentAt",
        "warehouseName",
        "consumerCode",
        "consumerName",
        "materialCode",
        "materialName",
        "materialMeasurementName",
        "materialCountPackage",
        "incomeQty",
        "expenseQty",
        "isLock",
        "description",
        "movingStatus",
        "createdBy",
        "createdAt",
        "lockedBy",
        "lockedAt",
      ];
  const filteredColumns: FilteredColumnsTransaction = {};
  for (const key of keys) {
    if (columns[key]) {
      filteredColumns[key] = columns[key];
    }
  }
  return filteredColumns;
};
