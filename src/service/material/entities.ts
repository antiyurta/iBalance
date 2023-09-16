import { GenericResponse, IFilters, Meta } from "../entities";

export interface IParams {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  materialSectionId?: number[] | string[];
}

export interface IDataUnitCode {
  id: number;
  code: string;
  name: string;
}

export interface IDataMaterial {
  id: number;
  fileIds: number[];
}

export interface IUnitCodeResponse extends GenericResponse {
  response: {
    data: IDataUnitCode[];
    meta: Meta;
  };
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
