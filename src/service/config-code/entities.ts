import { GenericResponse, IData } from "../entities";
/** Огнооны төрлүүд */
export enum DateType {
  Month = "MONTH",
  Season = "SEASON",
  HalfYear = "HALF_YEAR",
  Year = "YEAR",
}
export interface IDataConfigCode extends IData {
  id: number;
  type: DateType;
  counter: number;
  openerAt: Date;
}
export interface IResponseConfigCode extends GenericResponse {
  response: IDataConfigCode;
}
