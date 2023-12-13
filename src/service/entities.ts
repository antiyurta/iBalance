import { Breakpoint } from "antd";

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
export enum Operator {
  Equals = "EQUALS",
  NotEqual = "NOT_EQUAL",
  Contains = "CONTAINS",
  NotContains = "NOT_CONTAINS",
  IsGreater = "IS_GREATER",
  IsGreatorOrEqual = "IS_GREATOR_OR_EQUAL",
  IsLess = "IS_LESS",
  IsLessOrEqual = "IS_LESS_OR_EQUAL",
}
export interface GenericResponse {
  success: boolean;
  message: string;
  statusCode: number;
}
export interface Meta {
  page?: number;
  limit?: number;
  itemCount?: number;
  pageCount?: number;
  hasNextPage?: boolean;
}

export interface IFilters {
  code: number[];
  name: string[];
  isIndividual: boolean[];
  isEmployee: boolean[];
  lastName: string[];
  regno: string[];
  phone: string[];
  address: string[];
  bankId: number[];
  bankAccountNo: string[];
  email: string[];
  sectionId: number[];
  consumerSectionId: number[];
  isAccount: boolean[];
  accountCode: number[];
  consumerCode: number[];
  consumerLastname: string[];
  accountName: string[];
  consumerName: string[];
  consumerIsIndividual: boolean[];
  consumerPhone: string[];
  consumerIsActive: boolean[];
  consumerRegno: string[];
  membershipCardno: string[];
  membershipName: string[];
  branch: string[];
  endAt: string[];
  createdAt: string[];
  amount: number[];
  measurementId: number[];
  countPackage: number[]; // ene sonin
  brandId: number[];
  isCitizenTax: boolean[];
  isTax: boolean[];
  isClose: boolean[];
  isActive: boolean[];
  limitAmount: number[];
  type: string[];
  countryId: number[];
  shortName: string[];
  barCode: string[];
  serial: string[];
  unitCodeId: number[];
  materialSectionId: number[];
  rankId: number[];
  accountNo: number[];
  updatedAt: string[];
  updatedBy: string[];
  updatedUser: object[];
  description: string[];
}
export interface IFilter {
  createdAt?: string;
  createdBy?: string[];
  updatedAt?: string;
  updatedBy?: string[];
}
export type ColumnType = {
  responsive?: Breakpoint[];
  width?: number;
  label: string; // ner mongol
  isView: boolean; // mor haragdah eseh
  isFiltered: boolean; // filterlegdsn eseh
  dataIndex: string | string[]; // dataIndex
  type: DataIndexType; // torol baina torloes hamarch filter utga hamaarna
};

export type FilteredColumns = { [T in keyof IFilters]?: ColumnType };

export interface Queries {
  param: string;
  operator?: string;
  value?: number | string;
  typeof?: "string" | "number" | "date";
}
export interface IParam {
  queries?: Queries[];
  orderParam?: string;
  order?: RadioType;
}
export interface IData {
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export enum DataIndexType {
  MULTI = "MULTI", // too bolon string
  STRING_SECTION = "STRING_SECTION",
  DATE = "DATE",
  DATETIME = "DATETIME",
  TIME = "TIME",
  COUNTRY = "COUNTRY",
  //
  USER = "USER",
  ENUM = "ENUM",
  // measuer ued
  MEASUREMENT = "MEASUREMENT",
  // measuer ued
  NUMBER = "NUMBER",
  VALUE = "VALUE",
  TRANSACTION = "TRANNSACTION",
  STRING = "STRING",

  STRING_TREE = "STRING_TREE",
  STRING_CONSUMER_CODE = "STRING_CONSUMER_CODE",
  STRING_CONSUMER_NAME = "STRING_CONSUMER_NAME",
  STRING_CONSUMER_SECTION = "STRING_CONSUMER_SECTION",
  //
  STRING_ACCOUNT_CODE = "STRING_ACCOUNT_CODE",
  //
  STRING_BANK = "STRING_BANK",
  BOOLEAN = "BOOLEAN",
  BOOLEAN_STRING = "BOOLEAN_STRING",
}
export enum RadioType {
  ASC = "ASC",
  DESC = "DESC",
}

export type DescMode = "NORMAL" | "PICTURE";

export type TreeMode = "NORMAL" | "STORAGE" | "UNIT" | "MATERIAL" | "CONSUMER";

export type ComponentType = "FULL" | "MODAL" | "MIDDLE" | "LITTLE";

export interface IDataFile {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
}
//**report uud */
export interface IFiltersReport {
  RStorage1: string;
}

export type FilterType = {
  interval: string;
  date?: string;
};

export type FilteredReport = { [T in keyof IFiltersReport]?: FilterType };
