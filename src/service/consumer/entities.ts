import { ColumnType, GenericResponse, IParam, Meta } from "../entities";
import { IDataReference } from "../reference/entity";
import { IDataTreeSection } from "../reference/tree-section/entities";
import { IDataConsumerMembership } from "./membership/entities";

export enum ToolsIcons {
  EQUALS = "/icons/tools/Equals.png",
  NOT_EQUAL = "/icons/tools/notEquals.png",
  CONTAINS = "/icons/tools/Contains.png",
  NOT_CONTAINS = "/icons/tools/notContains.png",
  IS_GREATER = "/icons/tools/isGreetThan.png",
  IS_GREATOR_OR_EQUAL = "/icons/tools/isGreetThanOrEqual.png",
  IS_LESS = "/icons/tools/isLessThan.png",
  IS_LESS_OR_EQUAL = "/icons/tools/isLessThanOrEqual.png",
}
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
}
export interface IFilterConsumer {
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
  updatedAt?: string;
  updatedBy?: number[];
}
export type FilteredColumnsConsumer = {
  [T in keyof IFilterConsumer]?: ColumnType;
};

export interface IParamConsumer extends Meta, IParam, IFilterConsumer {
  memberships?: boolean;
}
export interface IResponseConsumer extends GenericResponse {
  response: {
    data: IDataConsumer[];
    meta: Meta;
    filter: IFilterConsumer;
  };
}
