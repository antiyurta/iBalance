import { GenericResponse, IFilters, IParam, Meta } from "../../entities";

export enum MeasurementType {
  Area = "AREA", //тайлбай
  Length = "LENGTH", // urt
  Quantity = "Quantity", // too
  Time = "TIME", // hugtsaa
  Volume = "VOLUME", // эзлэхүүн
  Weight = "WEIGTH", // jin
  Other = "OTHER", // Тусгай хэмжих нэгж
}

export interface IParamUnitOfMeasure extends IParam {}

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
export interface IResponseMeasure extends GenericResponse {
  response: IParamUnitOfMeasure;
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
