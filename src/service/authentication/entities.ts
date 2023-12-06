import { ColumnType } from "../entities";

interface GenericResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

type TypeGender = "MAN" | "WOMAN";

interface IEmployee {
  email: string;
  firstName: string;
  gender: TypeGender;
  homeAddress: string;
  isWorking: boolean;
  lastName: string;
  phoneNo: string;
  registerNumber: string;
}

interface IHospital {
  address: string;
  name: string;
}

interface IRole {
  id: number;
  name: string;
  description: string;
}

export interface IUser {
  imageId: number;
  createdAt: string;
  dataBase: string;
  deletedAt: string;
  email: string;
  employee: IEmployee;
  firstName: string;
  globalPatient: boolean;
  hospital: IHospital;
  hospitalId: number;
  id: number;
  isActive: boolean;
  isEmailConfirmed: boolean;
  lastName: string;
  phonoNo: string;
  role: IRole;
  roleId: number;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse extends GenericResponse {
  response: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface LogoutResponse extends GenericResponse {
  statusCode: number;
}
export interface IChangeProfile {
  imageId: number;
}
export interface IFilterUser {
  createdAt?: string;
  email?: string;
  firstName?: string;
  hospitalId?: number;
  ids?: number;
  isActive?: boolean;
  lastName?: string;
  phonoNo?: string;
}
export type FilteredColumnsUser = {
  [T in keyof IFilterUser]?: ColumnType;
};
export interface AuthenticationResponse extends GenericResponse {
  response: IUser;
}
export interface IResponseUsers extends GenericResponse {
  response: IUser[];
}
export interface IResponseUser extends GenericResponse {
  response: IUser;
}
export interface IParamUser {
  ids?: number[];
}
