import { GenericResponse, IData, IFilter, IParam, Meta } from "@/service/entities";
import { IDataCountry } from "../country/entities";

export interface IDataBrand extends IData {
  id: number;
  countryId: number;
  country: IDataCountry;
  name: string;
}
export interface IFilterBrand extends IFilter {
  countryId?: number;
  name?: string;
}
export interface IParamBrand extends Meta, IParam, IFilterBrand {}

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
