import { GenericResponse, IFilters, Meta } from "@/service/entities";

export interface IDataStorage {
  countryId: number;
  createdAt: string;
  createdBy: number;
  id: number;
  name: string;
  updatedAt: string;
  updatedBy: number;
}

export interface IParams {
  page?: number | undefined;
  limit?: number | undefined;
}

export interface IBrandResponse extends GenericResponse {
  response: {
    data: IDataStorage[];
    meta: Meta;
    filter: IFilters;
  };
}
