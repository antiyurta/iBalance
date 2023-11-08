import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";
import { IDataMaterial } from "@/service/material/entities";

export interface IDataMembership {
  id: number;
  name: string;
  isSave: boolean;
  isActive: boolean;
  isPercent: boolean;
  isSale: boolean;
  discount: number;
  limitDiscount: number;
  description: string;
  materialId: number;
  createdBy: number;
  createdAt: string;
  updatedBy: number;
  updatedAt: string;
  deletedAt: string;
  material: IDataMaterial;
}

export interface IInputMembership extends IDataMembership {
  materialCode: string;
}
export interface IFilterMembership extends IFilter {
  name?: string[];
  isSave?: boolean[];
  isBalance?: boolean[];
  isActive?: boolean[]
  isPercent?: boolean[];
  isSale?: boolean[];
  discount?: number[];
  limitDiscount?: number[];
  description?: string[];
}
export type FilteredColumnsMembership = {
  [T in keyof IFilterMembership]?: ColumnType;
};
export interface IParamMembership extends IFilterMembership, Meta, IParam {}

export interface IResponseMembership extends GenericResponse {
  response: {
    data: IDataMembership[];
    meta: Meta;
    filter: IParamMembership;
  };
}
