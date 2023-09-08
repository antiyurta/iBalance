import { GenericResponse, IFilters, Meta } from "../../entities";

export enum MeasurementType {
  Area = "AREA",
  Length = "LENGTH",
  Quantity = "Quantity",
  Time = "TIME",
  Volume = "VOLUME",
  Weight = "WEIGTH",
}

export interface IParams {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  sectionId?: number[] | string[];
}

export interface IDataUnitOfMeasure {
  id: number;
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
