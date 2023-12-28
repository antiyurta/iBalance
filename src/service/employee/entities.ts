import { JobPosition } from "../authentication/entities";
import { GenericResponse } from "../entities";

type TypeGender = "MAN" | "WOMAN";
/** Ажилтаны төрөл */
export enum EmployeeType {
  NOT_MEDICAL = 0, // Эмнэл зүйн бус
  JOB_POSITION = 1, // Ажлын байр
  MEDICAL = 2, // Эмнэл зүй
}
export interface IDataEmployee {
  id: number;
  registerNumber: string;
  firstName: string;
  lastName: string;
  dateInEmployment: Date;
  dateOutEmployment: Date;
  type: EmployeeType;
  email: string;
  gender: TypeGender;
  homeAddress: string;
  isWorking: boolean;
  phoneNo: string;
  roleId: number;
  jobPosition: JobPosition;
}
export interface IResponseEmployee extends GenericResponse {
  response: IDataEmployee;
}
