import { GenericResponse, Meta } from "../entities";
import { IDataReference } from "../reference/entity";
import { IDataConsumerSection } from "./section/entities";
export type DataIndex = keyof IDataConsumer;
export enum DataIndexType {
  NUMBER = "NUMBER",
  STRING = "STRING",
  STRING_TREE = "STRING_TREE",
  STRING_BANK = "STRING_BANK",
  BOOLEAN = "BOOLEAN",
  BOOLEAN_STRING = "BOOLEAN_STRING",
}
export type Index =
  | "code"
  | "isIndividual"
  | "isEmployee"
  | "isActive"
  | "lastName"
  | "name"
  | "sectionId"
  | "regno"
  | "phone"
  | "address"
  | "bankId"
  | "bankAccountNo"
  | "email"
  | "isActive";
export type DynamicKey = `${Index}`;

export type ColumnType = {
  label: string; // ner mongol
  isView: boolean; // mor haragdah eseh
  isFiltered: boolean; // filterlegdsn eseh
  dataIndex: DataIndex | DataIndex[]; // dataIndex
  type: DataIndexType; // torol baina torloes hamarch filter utga hamaarna
};

export type FilteredColumns = { [T in DynamicKey]?: ColumnType };

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

export enum RadioType {
  ASC = "ASC",
  DESC = "DESC",
}

export interface Quearies {
  param: string;
  operator?: string;
  value?: number | string;
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
  code: number;
  isActive: boolean;
  isEmployee: boolean;
  isIndividual: boolean;
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

export interface IConsumerResponse extends GenericResponse {
  response: {
    data: IDataConsumer[];
    meta: Meta;
  };
}

export interface IConsumerResponseUpdate extends GenericResponse {
  response: IDataConsumer;
}
