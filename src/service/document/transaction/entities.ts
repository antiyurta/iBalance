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
import { IDataDocument, IFilterDocument, MovingStatus } from "../entities";

export interface IDataTransaction extends IData {
  id?: number;
  materialId?: number;
  material?: IDataMaterial;
  documentId: number;
  document?: IDataDocument;
  lastQty: number;
  incomeQty: number;
  expenseQty: number;
  unitAmount?: number;
  totalAmount?: number;
  amount?: number;
  discountAmount?: number;
  transactionAt?: string;
  excessOrDeficiency?: number;
  convertMaterialId?: number;
  convertMaterial?: IDataMaterial;
  convertQuantity: number;
  convertLastQty?: number;
  description?: string;
  refundDocumentId?: number;
}

export interface IFilterTransaction extends IFilterDocument {
  documentId?: number[];
  materialCode?: string[];
  materialName?: string[];
  materialMeasurementName?: string[];
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

export interface IParamTransaction extends Meta, IParam, IFilterTransaction {}

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
export const getTransactionColumns = (
  status?: MovingStatus
): FilteredColumnsTransaction => {
  const columns: FilteredColumnsTransaction = {
    documentId: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
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
    incomeQty: {
      label: "Орлогын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "incomeQty",
      type: DataIndexType.MULTI,
    },
    expenseQty: {
      label: "Зарлагын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "expenseQty",
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
      dataIndex: "isLock",
      type: DataIndexType.BOOLEAN_STRING,
    },
  };
  if (status == MovingStatus.Purchase || status == MovingStatus.SaleReturn) {
    columns.transactionAt = {
      label: "Дуусах хугацаа",
      isView: true,
      isFiltered: false,
      dataIndex: "transactionAt",
      type: DataIndexType.DATE,
    };
  }
  if (status == MovingStatus.Sales) {
    columns.paymentMethodName = {
      label: "Төлбөрийн хэлбэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "paymentMethod", "name"],
      type: DataIndexType.MULTI,
    };
    columns.unitAmount = {
      label: "Нэгжийн үнэ",
      isView: true,
      isFiltered: false,
      dataIndex: "unitAmount",
      type: DataIndexType.VALUE,
    };
    columns.totalAmount = {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: "totalAmount",
      type: DataIndexType.VALUE,
    };
    columns.discountAmount = {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: false,
      isFiltered: false,
      dataIndex: "discountAmount",
      type: DataIndexType.VALUE,
    };
    columns.amount = {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: "amount",
      type: DataIndexType.VALUE,
    };
  }
  if (status == MovingStatus.ItemConversion) {
    columns.convertMaterialName = {
      label: "Хөрвүүлсэн барааны нэр",
      isView: true,
      isFiltered: true,
      dataIndex: ["convertMaterial", "name"],
      type: DataIndexType.MULTI,
    };
    columns.convertMaterialName = {
      label: "Хөрвүүлсэн барааны хэмжих нэгж",
      isView: true,
      isFiltered: true,
      dataIndex: ["convertMaterial", "measurement", "name"],
      type: DataIndexType.MULTI,
    };
    columns.convertMaterialCountPackage = {
      label: "Хөрвүүлсэн барааны багц доторх тоо",
      isView: true,
      isFiltered: true,
      dataIndex: ["convertMaterial", "countPackage"],
      type: DataIndexType.MULTI,
    };
    columns.convertLastQty = {
      label: "Хөрвүүлсэн барааны эцсийн үлдэгдэл",
      isView: true,
      isFiltered: true,
      dataIndex: "convertLastQty",
      type: DataIndexType.MULTI,
    };
    columns.convertQuantity = {
      label: "Хөрвүүлсэн барааны тоо ширхэг",
      isView: true,
      isFiltered: true,
      dataIndex: "convertQuantity",
      type: DataIndexType.MULTI,
    };
  }
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
    dataIndex: ["updatedUser", "firstName"],
    type: DataIndexType.USER,
  };
  columns.updatedAt = {
    label: "Түгжсэн огноо",
    isView: false,
    isFiltered: true,
    dataIndex: "updatedAt",
    type: DataIndexType.DATETIME,
  };
  switch (status) {
    case MovingStatus.Sales ||
      MovingStatus.PurchaseReturn ||
      MovingStatus.InOperation ||
      MovingStatus.ActAmortization ||
      MovingStatus.MovementInWarehouse:
      if (columns.incomeQty) columns.incomeQty.isView = false;
      break;
    case MovingStatus.Purchase || MovingStatus.SaleReturn:
      if (columns.expenseQty) columns.expenseQty.isView = false;
      break;
    default:
      break;
  }
  return columns;
};
