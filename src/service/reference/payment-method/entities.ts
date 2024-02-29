import { GenericResponse, IColumn, IData, IParam, Meta } from "@/service/entities";
/** Төлбөрийн хэлбэр */
export enum PaymentType {
  Cash = "CASH", // Бэлэн
  Lend = "LEND", // Зээл
  NotCash = "NOT_CASH", // Бэлэн бус
  GiftCart = 'GIFT_CART', // Бэлгийн карт
  Membership = 'MEMBERSHIP', // Гишүүнчлэл
}
export interface IDataReferencePaymentMethod {
  id: number;
  logo: string;
  name?: string;
  type: PaymentType;
  isActive?: boolean;
  fee?: number;
}
export interface IParamPaymentMethod extends IParam {
  name?: string;
  type?: PaymentType;
  isActive?: boolean;
}
export interface IResponsePaymentMethods extends GenericResponse {
  response: IDataReferencePaymentMethod[];
}
export interface IResponsePaymentMethod extends GenericResponse {
  response: {
    data: IDataReferencePaymentMethod;
    meta: Meta;
  };
}
