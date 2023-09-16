import { GenericResponse } from "../entities";

export interface IDataUser {
  id: number;
  firstName: string;
}

export interface IDataReference {
  id?: number;
  name: string;
  type: IType;
}

export interface IUserResponse extends GenericResponse {
  response: IDataUser[];
}

export interface IReferenceResponse extends GenericResponse {
  response: IDataReference[];
}

export enum IType {
  BANK = "BANK",
  MATERIAL_RANK = "MATERIAL_RANK",
}
