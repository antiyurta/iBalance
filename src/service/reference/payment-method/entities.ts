import {
  ColumnType,
  GenericResponse,
  IData,
  IParam,
  Meta,
} from "@/service/entities";
/** Төлбөрийн хэлбэр */
export enum PaymentType {
  /** Бэлэн */
  Cash = "CASH",
  /** Зээл */
  Lend = "LEND",
  /** Бэлэн бус */
  NotCash = "NOT_CASH",
}
export interface IDataReferencePaymentMethod extends IData {
  id: number;
  imageUrl: string;
  name: string;
  type: PaymentType;
  isActive: boolean;
}

export interface IResponsePaymentMethods extends GenericResponse {
  response: {
    data: IDataReferencePaymentMethod[];
    meta: Meta;
  };
}
export interface IResponsePaymentMethod extends GenericResponse {
  response: {
    data: IDataReferencePaymentMethod;
    meta: Meta;
  };
}
