import { Breakpoint } from "antd";
import { Dayjs } from "dayjs";
export type Tool =
  | "EQUALS"
  | "NOT_EQUAL"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "IS_GREATER"
  | "IS_GREATOR_OR_EQUAL"
  | "IS_LESS"
  | "IS_LESS_OR_EQUAL";
export interface ITool {
  logo: string;
  title: string;
  operator: Tool;
}
export interface SelectObject {
  value: string | number | boolean;
  label: string;
}
export type TypeCheck = number | string | boolean | SelectObject;
export enum Operator {
  Equals = "EQUALS",
  NotEqual = "NOT_EQUAL",
  Contains = "CONTAINS",
  NotContains = "NOT_CONTAINS",
  IsGreater = "IS_GREATER",
  IsGreatorOrEqual = "IS_GREATOR_OR_EQUAL",
  IsLess = "IS_LESS",
  IsLessOrEqual = "IS_LESS_OR_EQUAL",
  In = "IN",
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
  country: string[];
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
export interface IColumn {
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
  dataIndex: string[]; // dataIndex
  type: DataIndexType; // torol baina torloes hamarch filter utga hamaarna
  key?: string; // amaraa nemew array object oos ali negin render hiih
};

export type FilteredColumns = { [T in keyof IFilters]?: ColumnType };

export interface IFilter {
  dataIndex: string[];
  operator?: string;
  filter: string | number | boolean | (string | number | boolean)[];
}
export interface IParam {
  filters?: IFilter[];
  orderParam?: string[];
  order?: RadioType;
  page?: number;
  limit?: number;
}
export interface IData {
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
export enum DataIndexType {
  MULTI = "MULTI", // too bolon string
  STRING_SECTION = "STRING_SECTION",
  DATE = "DATE",
  DATETIME = "DATETIME",
  TIME = "TIME",
  //amara nemew 1/24
  ARREY = "ARREY",
  //
  USER = "USER",
  ENUM = "ENUM",
  NUMBER = "NUMBER",
  VALUE = "VALUE",
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
export type RadioType = "ASC" | "DESC";

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
export type ISelectDateType =
  | "that"
  | "between"
  | "until"
  | "late"
  | "selection"
  | "year"
  | "month"
  | "quarter";

export type ISelectValueType = "all" | "section" | "that" | "selection";

export type DateFilter = {
  interval: ISelectDateType;
  dates?: Dayjs[];
  date?: Dayjs;
};
