import { GenericResponse, IFilters, Meta } from "../entities";

export interface IParams {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  sectionId?: number[] | string[];
}

export interface IDataMaterial {
  id: number;
}

export interface IMaterialResponse extends GenericResponse {
  response: {
    data: IDataMaterial[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IConsumerResponseUpdate extends GenericResponse {
  response: IDataMaterial;
}
