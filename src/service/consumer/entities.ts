import { IUser } from "../authentication/entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IParam,
  Meta,
  SelectObject,
} from "../entities";
import { IDataReference } from "../reference/entity";
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
  updatedUser: IUser;
}
export interface IFilterConsumer extends IColumn {
  code?: number[];
  isIndividual?: boolean[];
  isEmployee?: boolean[];
  lastName?: string[];
  name?: string[];
  sectionName?: string[];
  regno?: string[];
  phone?: string[];
  address?: string[];
  bank?: SelectObject[];
  bankAccountNo?: string[];
  email?: string[];
  isSupplier?: boolean;
  isActive?: boolean[];
}
export type FilteredColumnsConsumer = {
  [T in keyof IFilterConsumer]?: ColumnType;
};

export interface IParamConsumer extends IParam {
  ids?: number[];
  sectionId?: number[];
  registerNumber?: string;
  isMembership?: boolean;
  isLendLimit?: boolean;
  isBalance?: boolean;
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
