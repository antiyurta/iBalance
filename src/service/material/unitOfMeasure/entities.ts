import { GenericResponse, IFilters, Meta } from "../../entities";

export enum MeasurementType {
  Area = "AREA", //тайлбай
  Length = "LENGTH", // urt
  Quantity = "Quantity", // too
  Time = "TIME", // hugtsaa
  Volume = "VOLUME", // shingen
  Weight = "WEIGTH", // jin
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
