import {
  ColumnType,
  GenericResponse,
  IData,
  IParam,
  Meta,
} from "@/service/entities";

export interface IDataUnitCode extends IData {
  id: number;
  code: string;
  name: string;
}

export interface IFilterUnitCode {
  code?: string[];
  name?: string[];
  updatedBy?: number[];
}
export type FilteredColumnsUnitCode = {
  [T in keyof IFilterUnitCode]?: ColumnType;
};
export interface IParamUnitCode extends IFilterUnitCode, Meta, IParam {}

export interface IResponseUnitCode extends GenericResponse {
  response: {
    data: IDataUnitCode[];
    meta: Meta;
    filter: IFilterUnitCode;
  };
}
export interface IResponseOneUnitCode extends GenericResponse {
  response: IDataUnitCode;
}
