import { IUser } from "../authentication/entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IParam,
  Meta,
} from "../entities";

// START => Reference section
export interface IDataReference {
  id?: number;
  name: string;
  type: IType;
}
export interface IFilterReference extends IColumn {
  name?: string[];
}
export type FilteredColumnsReference = {
  [T in keyof IFilterReference]?: ColumnType;
};
export interface IParamReference extends IParam {
  type: IType;
}
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
