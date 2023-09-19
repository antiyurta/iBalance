import {
  ColumnType,
  GenericResponse,
  Meta,
  Quearies,
} from "@/service/entities";
import { IDataMaterial } from "@/service/material/entities";

export interface IDataMembership {
  id: number;
  cardNo: string;
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
export interface IFilterMembership {
  cardNo?: string[];
  name?: string[];
  isSave?: boolean[];
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
export interface IParamMembership extends IFilterMembership, Meta {}

export interface IResponseMembership extends GenericResponse {
  response: {
    data: IDataMembership[];
    meta: Meta;
    filter: IParamMembership;
  };
}
