import {
  DataIndexType,
  GenericResponse,
  Meta,
  Quearies,
  RadioType,
} from "../entities";

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  name?: string[];
  sectionId?: string[] | number[];
  isAccount?: boolean[];
  limitAmount?: number[];
  isClose?: boolean[];
  isActive?: boolean[];
  updatedAt?: string[];
  updatedBy?: number[];
  queries?: Quearies[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}

export interface IDataReceivableAccount {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export type Index = "code" | "name" | "updatedAt" | "updatedBy";
export type DynamicKey = `${Index}`;

export type ColumnType = {
  label: string; // ner mongol
  isView: boolean; // mor haragdah eseh
  isFiltered: boolean; // filterlegdsn eseh
  dataIndex: DataIndex | DataIndex[]; // dataIndex
  type: DataIndexType; // torol baina torloes hamarch filter utga hamaarna
};

export type FilteredColumnsReceivableAccount = {
  [T in DynamicKey]?: ColumnType;
};

export type DataIndex = keyof IDataReceivableAccount;

export type Filter = { [T in DataIndex]?: number[] | string[] };

export interface IReceivableAccountResponse extends GenericResponse {
  response: {
    data: IDataReceivableAccount[];
    meta: Meta;
    filter: Filter;
  };
}

export interface IReceivableAccountResponseUpdate extends GenericResponse {
  response: IDataReceivableAccount;
}
