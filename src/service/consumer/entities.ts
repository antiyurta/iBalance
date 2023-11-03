import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataReference, IDataUser } from "../reference/entity";
import { IDataTreeSection } from "../reference/tree-section/entities";
import { IDataConsumerMembership } from "./membership/entities";

export interface IDataConsumer {
  id: number;
  code: string;
  isActive: boolean;
  isEmployee: boolean;
  isIndividual: boolean;
  isSupplier: boolean;
  ebarimtNo: number;
  email: string;
  lastName: string;
  name: string;
  phone: string;
  regno: string;
  sectionId: number;
  section: IDataTreeSection;
  address: string;
  bankAccountNo: string;
  bankId: number;
  bank: IDataReference;
  memberships: IDataConsumerMembership[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  updatedUser: IDataUser;
}
export interface IFilterConsumer extends IFilter {
  code?: number[];
  isIndividual?: boolean[];
  isEmployee?: boolean[];
  lastName?: string[];
  name?: string[];
  sectionId?: number[] | string[];
  regno?: string[];
  phone?: string[];
  address?: string[];
  bankId?: number[];
  bankAccountNo?: string[];
  email?: string[];
  isActive?: boolean[];
  createdAt?: string;
}
export type FilteredColumnsConsumer = {
  [T in keyof IFilterConsumer]?: ColumnType;
};

export interface IParamConsumer extends Meta, IParam, IFilterConsumer {
  ids?: number[];
  lendLimits?: boolean;
  initialBalances?: boolean;
  memberships?: boolean;
  isSupplier?: boolean;
}
export interface IResponseConsumer extends GenericResponse {
  response: {
    data: IDataConsumer[];
    meta: Meta;
    filter: IFilterConsumer;
  };
}

export interface IResponseOneConsumer extends GenericResponse {
  response: IDataConsumer;
}
