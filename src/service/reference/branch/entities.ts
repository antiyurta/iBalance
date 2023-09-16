import {
  ColumnType,
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../../entities";
import { IDataTreeSection } from "../tree-section/entities";

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

export interface IDataBranch {
  id: number;
  sectionId: number;
  code: number | string;
  name: string;
  provinceId: number;
  districtId: number;
  fileId: number;
  isActive: string;
  section: IDataTreeSection;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type FilteredColumns = { [T in keyof IFilters]?: ColumnType };

export interface IBranchResponse extends GenericResponse {
  response: {
    data: IDataBranch[];
    meta: Meta;
    filter: IFilters;
  };
}
