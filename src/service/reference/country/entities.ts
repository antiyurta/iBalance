import {
  GenericResponse,
  IData,
  IFilter,
  IParam,
  Meta,
} from "@/service/entities";

export interface IDataCountry extends IData {
  id: number;
  name: string;
  parentId: number;
  position: number;
  type: number;
}
export interface IFilterCountry extends IFilter {
  id: number;
  name: string;
  parentId: number;
  position: number;
  type: number;
}
export interface IParamCountry extends Meta, IParam, IFilterCountry {}

export interface IResponseCountry extends GenericResponse {
  response: {
    data: IDataCountry[];
    meta: Meta;
  };
}