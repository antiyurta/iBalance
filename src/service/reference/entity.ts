import { IUser } from "../authentication/entities";
import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "../entities";

// START => Reference section
export interface IDataReference {
  id?: number;
  name: string;
  type: IType;
}
export interface IFilterReference {
  name?: string[];
  type: IType;
}
export type FilteredColumnsReference = {
  [T in keyof IFilterReference]?: ColumnType;
};
export interface IParamReference extends IParam, IFilterReference {}
// END => Reference section
export interface IUserResponse extends GenericResponse {
  response: IUser[];
}

export interface IResponseReference extends GenericResponse {
  response: {
    data: IDataReference[];
    meta: Meta;
    filter: IFilterReference;
  };
}

export enum IType {
  BANK = "BANK", // Банк
  MATERIAL_RANK = "MATERIAL_RANK", // Барааны зэрэглэл
  REASON_REFUND = "RETURN", // Буцаалтын шалтгаан
  MONEY = "MONEY", // мөнгөн дэвсгэрт
}
