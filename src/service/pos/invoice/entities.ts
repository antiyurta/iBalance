import { GenericResponse, IData } from "@/service/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";
import { IDataPosOpenClose } from "../open-close/entities";
import { IDataPosDocument } from "@/service/document/pos-document/entites";
import { IDataEmployee } from "@/service/employee/entities";

export interface GetInvoiceDto {
  openCloseId?: number;
  type?: PaymentType;
  isPaid?: boolean;
}
export interface IDataPaymentInvoice extends IData {
  id?: number;
  openCloseId?: number;
  openClose?: IDataPosOpenClose;
  posDocumentId?: number;
  posDocument?: IDataPosDocument;
  employeeId?: number;
  employee?: IDataEmployee;
  type: PaymentType;
  isLocal?: boolean;
  paymentMethodName?: string;
  incomeAmount?: number;
  expenseAmount?: number;
  description?: string;
}

export interface IResponsePaymentInvoices extends GenericResponse {
  response: IDataPaymentInvoice[];
}
export interface IResponsePaymentInvoice extends GenericResponse {
  response: IDataPaymentInvoice;
}
