import { GenericResponse, IFilters, Meta } from "@/service/entities";

export interface IDataBrand {
  countryId: number;
  createdAt: string;
  createdBy: number;
  id: number;
  name: string;
  updatedAt: string;
  updatedBy: number;
}

export interface IDataCountry {
  createdAt: string;
  id: number;
  name: string;
  parentId: number;
  position: number;
  type: number;
  updatedAt: string;
}

export interface IParams {
  page?: number | undefined;
  limit?: number | undefined;
}

export interface ICountryResponse extends GenericResponse {
  response: {
    data: IDataCountry[];
    meta: Meta;
  };
}

export interface IBrandResponse extends GenericResponse {
  response: {
    data: IDataBrand[];
    meta: Meta;
    filter: IFilters;
  };
}
