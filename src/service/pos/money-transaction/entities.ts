import {
  ColumnType,
  GenericResponse,
  IFilter,
  Meta,
} from "@/service/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";
import { IDataPosOpenClose } from "../open-close/entities";
import { IDataEmployee } from "@/service/employee/entities";
export interface IParamMoneyTransaction extends Meta {
  openCloseId?: number;
  type?: PaymentType;
  isTransaction?: boolean;
}

export interface IDataMoneyTransaction {
  id?: number;
  openCloseId: number;
  openClose?: IDataPosOpenClose;
  toEmployeeId?: number;
  toEmployee?: IDataEmployee;
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
