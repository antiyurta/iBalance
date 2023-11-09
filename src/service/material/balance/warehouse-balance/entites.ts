import { ColumnType, GenericResponse, Meta } from "@/service/entities";
import { IDataBalance, IFilterBalance } from "../entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";

export interface IDataWarehouseBalance {
  id: number;
  balanceId: number; // Үлдэгдэлийн дугаар
  balance: IDataBalance; // Үлдэгдэлийн мэдээлэл
  warehouseId: number; // Байршилын дугаар
  warehouse: IDataWarehouse; // Байршилын мэдээлэл
  quantity: number; // Эхний үлдэгдэл
  createdAt: string;
  updatedAt: string;
}

export interface IFilterWarehouseBalance extends IFilterBalance {
  warehouseId?: number[]; // Байршил
}

export type FilteredColumnsWarehouseBalance = {
  [T in keyof IFilterWarehouseBalance]?: ColumnType;
};

export interface IParamWarehouseBalance extends IFilterWarehouseBalance, Meta {}

export interface IResponseStorageBalance extends GenericResponse {
  response: {
    data: IDataWarehouseBalance[];
    meta: Meta;
    filter: IFilterWarehouseBalance;
  };
}
