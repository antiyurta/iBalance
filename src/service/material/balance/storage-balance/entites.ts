import {
  ColumnType,
  GenericResponse,
  Meta,
} from "@/service/entities";
import { IDataStorage } from "../../storage/entities";
import { IDataBalance, IFilterBalance } from "../entities";

export interface IDataStorageBalance {
  id: number;
  balanceId: number; // Үлдэгдэлийн дугаар
  balance: IDataBalance; // Үлдэгдэлийн мэдээлэл
  storageId: number; // Байршилын дугаар
  storage: IDataStorage; // Байршилын мэдээлэл
  quantity: number; // Эхний үлдэгдэл
  createdAt: string;
  updatedAt: string;
}

export interface IFilterStorageBalance extends IFilterBalance {
  storageId?: number[]; // Байршил
}

export type FilteredColumnsStorageBalance = {
  [T in keyof IFilterStorageBalance]?: ColumnType;
};

export interface IParamStorageBalance extends IFilterStorageBalance, Meta {}

export interface IResponseStorageBalance extends GenericResponse {
  response: {
    data: IDataStorageBalance[];
    meta: Meta;
    filter: IFilterStorageBalance;
  };
}
