import { GenericResponse } from "../entities";

export interface IDataReference {
  id: number;
  name: string;
}

export interface IReferenceResponse extends GenericResponse {
  response: IDataReference[];
}

export enum IType {
  BANK = "BANK",
}
