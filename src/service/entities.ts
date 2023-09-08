export interface GenericResponse {
  success: boolean;
  message: string;
  statusCode: number;
}
export interface Meta {
  page: number;
  limit: number;
  itemCount?: number;
  pageCount?: number;
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
  isAccount: boolean[];
  accountCode: number[];
  accountName: string[];
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
  shortName: string[];
  barCode: string[];
  updatedAt: string[];
  updatedBy: string[];
}

export type ColumnType = {
  label: string; // ner mongol
  isView: boolean; // mor haragdah eseh
  isFiltered: boolean; // filterlegdsn eseh
  dataIndex: string | string[]; // dataIndex
  type: DataIndexType; // torol baina torloes hamarch filter utga hamaarna
};

export type FilteredColumns = { [T in keyof IFilters]?: ColumnType };

export interface Quearies {
  param: string;
  operator?: string;
  value?: number | string;
}

export enum DataIndexType {
  MULTI = "MULTI", // too bolon string
  STRING_SECTION = "STRING_SECTION",
  DATE = "DATE",
  // measuer ued
  MEASUREMENT = "MEASUREMENT",
  // measuer ued
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
export enum RadioType {
  ASC = "ASC",
  DESC = "DESC",
}

export type DescMode = "NORMAL" | "PICTURE";

export type TreeMode = "NORMAL" | "UNIT";
