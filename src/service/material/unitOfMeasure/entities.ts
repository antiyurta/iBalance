import { GenericResponse, IFilters, Meta } from "../../entities";

export enum MeasurementType {
  Area = "AREA",
  Length = "LENGTH",
  Quantity = "Quantity",
  Time = "TIME",
  Volume = "VOLUME",
  Weight = "WEIGTH",
}

export interface IParamUnitOfMeasure {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  type?: number[] | string[];
}

export interface IDataUnitOfMeasure {
  createdAt: string;
  createdBy: number;
  deletedAt: string;
  id: number;
  name: string;
  shortName: string;
  type: MeasurementType;
  updatedAt: string;
  updatedBy: number;
}

export interface IUnitOfMeasurePostResponse extends GenericResponse {
  response: IDataUnitOfMeasure;
}

export interface IUnitOfMeasureResponse extends GenericResponse {
  response: {
    data: IDataUnitOfMeasure[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IConsumerResponseUpdate extends GenericResponse {
  response: IDataUnitOfMeasure;
}
