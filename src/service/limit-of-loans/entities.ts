import { IUser } from "../authentication/entities";
import { IDataConsumer } from "../consumer/entities";
import {
  ColumnType,
  GenericResponse,
  IData,
  IFilters,
  IParam,
  Meta,
} from "../entities";
import { IDataLimitOfLoansAccount } from "./account/entities";

export interface IInputLimitOfLoans {
  consumerId: number;
  name: string;
  sectionId: number;
  limitAmount: number;
  isAccount: boolean;
  isClose: boolean;
  isActive: boolean;
  accounts?: {
    accountId: number;
    name: string;
    amount: number;
  }[];
}

export interface IDataLimitOfLoans extends IData {
  consumer: IDataConsumer;
  consumerId: number;
  id: number;
  isAccount: boolean;
  isClose: boolean;
  accounts: IDataLimitOfLoansAccount[];
  limitAmount: number;
  createdUser: IUser;
}

export interface IFilterLimitOfLoans {
  code?: number[];
  name?: string[];
  sectionId?: number[];
  isAccount?: boolean[];
  limitAmount?: number[];
  isClose?: boolean[];
  isActive?: boolean[];
  updatedAt?: string[];
  updatedBy?: number[];
}

export type FilteredColumnsLimitOfLoans = {
  [T in keyof IFilterLimitOfLoans]?: ColumnType;
};

export interface IParamLimitOfLoans extends IFilterLimitOfLoans, Meta, IParam {
  consumerId?: number;
}

export interface ILimitOfLoansResponse extends GenericResponse {
  response: {
    data: IDataLimitOfLoans[];
    meta: Meta;
    filter: IFilters;
  };
}
export interface ILimitOfLoansResponseUpdate extends GenericResponse {
  response: IDataLimitOfLoans;
}
