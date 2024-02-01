import {
  GenericResponse,
  IColumn,
  IData,
  IParam,
  Meta,
} from "@/service/entities";

export interface IDataBrand extends IData {
  id: number;
  country: string;
  name: string;
}
export interface IFilterBrand extends IColumn {
  countryId?: number;
  name?: string;
}
export interface IParamBrand extends IParam, IFilterBrand {}

export interface IResponseBrand extends GenericResponse {
  response: {
    data: IDataBrand[];
    meta: Meta;
    filter: IFilterBrand;
  };
}
export interface IResponseOneBrand extends GenericResponse {
  response: IDataBrand;
}
