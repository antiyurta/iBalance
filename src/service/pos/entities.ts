import { GenericResponse, IData, IParam, Meta } from "@/service/entities";
import { IDataWarehouse } from "../reference/warehouse/entities";
export interface IDataPos extends IData {
  id: number;
  warehouseId: number;
  warehouse: IDataWarehouse;
  name: string;
  password: string;
  posUsers: IDataPosUser;
}
interface IDataPosUser {
  id: number;
  pasId: number;
  pos: IDataPos;
  userId: number;
}
export interface IParamPos extends Meta, IParam {
  warehouseId?: number;
  isAuth: boolean;
}

export interface IResponsePos extends GenericResponse {
  response: IDataPos;
}

export interface IResponsePointOfSales extends GenericResponse {
  response: {
    data: IDataPos[];
    meta: Meta;
  };
}
