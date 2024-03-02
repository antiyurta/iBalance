import { IDataPosOpenClose } from "@/service/pos/open-close/entities";
import { IDataDocument } from "../entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IData,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataTransaction } from "../transaction/entities";
import { IDataPaymentInvoice } from "@/service/pos/invoice/entities";
/** Гүйлгээний төлвүүд */
export enum DocumentStatus {
  Paid = "PAID", // Төлөлт гүйцэд хийгдсэн
  Lending = "LENDING", // Төлөлт зээлтэй
  Refund = "REFUND", // Төлөлт буцаагдсан
}
export interface IPosDocumentDto {
  regno?: string;
  warehouseId: number;
  openCloseId: number;
  code: string;
  invoices: IDataPaymentInvoice[];
  transactions: IDataTransaction[];
}
export interface IDataPosDocument extends IData {
  id: number;
  openCloseId: number;
  openClose?: IDataPosOpenClose;
  documentId: number;
  document?: IDataDocument;
  status: DocumentStatus;
  isEbarimt: boolean;
  billId: string;
  macAddress: string;
  lottery: string;
  internalCode: string;
  qrData: string;
  description: string;
  goodsDiscountAmount: number; // барааны хөнгөлөлт
  membershipPoint: number; // гишүүнчлэлийн оноо
  giftCartPoint: number; // Бэлгийн картын оноо
  totalAmount: number; // Нийт дүн
  payAmount: number; // Төлөх
  paidAmount: number; // Төлсөн дүн
  invoices?: IDataPaymentInvoice[]; // Төлбөр төлөлт
}
export interface IParamPosDocument extends IParam {
  status?: DocumentStatus;
}
export interface IFilterPosDocument extends IColumn {
  code?: string[];
  documentAt?: string;
  warehouseName?: string[];
  consumerCode?: string[];
  consumerName?: string[];
  expenseCount?: number[];
  expenseQuantity?: number[];
  incomeCount?: number[];
  incomeQuantity?: number[];
  goodsDiscountAmount: number[];
  membershipPoint: number[];
  giftCartPoint: number[];
  totalAmount: number[];
  payAmount: number[];
  paidAmount: number[];
  isEbarimt: boolean[];
}
export type FilteredColumnsPosDocument = {
  [T in keyof IFilterPosDocument]?: ColumnType;
};
export interface IResponsePosDocuments extends GenericResponse {
  response: {
    data: IDataPosDocument[];
    meta: Meta;
    filter: IFilterPosDocument;
  };
}
export interface IResponsePosDocument extends GenericResponse {
  response: IDataPosDocument;
}
