import { GenericResponse, IColumn, IData, IParam, Meta } from "@/service/entities";
/** Төлбөрийн хэлбэр */
export enum PaymentType {
  /** Бэлэн */
  Cash = "CASH",
  /** Зээл */
  Lend = "LEND",
  /** Бэлэн бус */
  NotCash = "NOT_CASH",
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
