import {
  ColumnType,
  GenericResponse,
  IData,
  IParam,
  Meta,
} from "@/service/entities";

export interface IDataReferencePaymentMethod extends IData {
  id: number;
  fileId?: number;
  name: string;
  isLend: boolean;
}
export interface IFilterReferencePaymentMethod {
  name?: string[];
  isLend?: boolean[];
  file?: string[];
  updatedAt?: string[];
  updatedBy?: number[];
}
export type FilteredColumnsPaymentMethod = {
  [T in keyof IFilterReferencePaymentMethod]?: ColumnType;
};
export interface IParamReferencePaymentMethod
  extends IFilterReferencePaymentMethod,
    Meta,
    IParam {}

export interface IResponsePaymentMethods extends GenericResponse {
  response: {
    data: IDataReferencePaymentMethod[];
    meta: Meta;
    filter: IFilterReferencePaymentMethod;
  };
}
export interface IResponsePaymentMethod extends GenericResponse {
  response: {
    data: IDataReferencePaymentMethod;
    meta: Meta;
  };
}
