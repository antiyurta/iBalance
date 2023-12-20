import {
  ColumnType,
  GenericResponse,
  IFilter,
  Meta,
} from "@/service/entities";
import { IDataPos } from "../entities";
import { PaymentType } from "@/service/reference/payment-method/entities";
export interface IParamMoneyTransaction extends Meta {
  posId?: number;
  isTransaction?: boolean;
}

export interface IDataMoneyTransaction {
  id?: number;
  posId: number;
  pos?: IDataPos;
  toPosId?: number;
  type: PaymentType;
  isTransaction: boolean;
  description: string;
  increaseAmount: number;
  decreaseAmount: number;
}
export interface IFilterMoneyTransaction extends IFilter {
  id: number;
  posId: number;
  increaseAmount: number;
}
export type FilteredColumnsMoneyTransaction = {
  [T in keyof IFilterMoneyTransaction]?: ColumnType;
};
export interface IResponseMoneyTransactions extends GenericResponse {
  response: {
    data: IDataMoneyTransaction[];
    meta: Meta;
  };
}
export interface IResponseMoneyTransaction extends GenericResponse {
  response: IDataMoneyTransaction;
}
