import { GenericResponse, IData } from "@/service/entities";
import { IDataShoppingCart } from "../shopping-card/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";

export interface GetInvoiceDto {
  shoppingCartId?: string;
  openCloseId?: number;
  type?: PaymentType;
  isPaid?: boolean;
}
export interface CreateInvoiceDto {
  shoppingCartId: string;
  paymentMethodId: number;
  amount: number; // Төлөх дүн
}
export interface CheckInvoiceDto {
  refNumber: string; // Захиалгын код
  paymentMethodId: number; //Төлбөр төрөл
}
export interface IDataPaymentInvoice extends IData {
  id: string;
  shoppingCartId: string;
  shoppingCart: IDataShoppingCart;
  paymentMethodId: number;
  paymentMethodLogo: string;
  paymentMethodName: string;
  amount: number;
  isPaid: boolean;
  currency: string;
  type: PaymentType;
}

export interface IResponsePaymentInvoices extends GenericResponse {
  response: IDataPaymentInvoice[];
}
export interface IResponsePaymentInvoice extends GenericResponse {
  response: IDataPaymentInvoice;
}
