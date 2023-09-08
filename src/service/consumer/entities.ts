import {
  ColumnType,
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../entities";
import { IDataReference } from "../reference/entity";
import { IDataConsumerSection } from "./section/entities";

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

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  isIndividual?: boolean[];
  isEmployee?: boolean[];
  lastName?: string[] | undefined;
  name?: string[];
  sectionId?: string[] | number[];
  regno?: string[];
  phone?: string[];
  address?: string[];
  bankId?: string[] | number[];
  bankAccountNo?: string[];
  email?: string[];
  isActive?: boolean[];
  queries?: Quearies[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}

export interface IDataConsumer {
  id: number;
  code: number | string;
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
  section: IDataConsumerSection;
  address: string;
  bankAccountNo: string;
  bankId: number;
  bank: IDataReference;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type FilteredColumns = { [T in keyof IFilters]?: ColumnType };

export interface IConsumerResponse extends GenericResponse {
  response: {
    data: IDataConsumer[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IConsumerResponseUpdate extends GenericResponse {
  response: IDataConsumer;
}
