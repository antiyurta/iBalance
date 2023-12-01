import { GenericResponse, IData } from "@/service/entities";
import { IDataShoppingGoods } from "../goods/entites";

export interface CreateTempDto {
  goodsIds: number[];
}
export interface IDataShoppingTemp extends IData {
  id: string;
  quantity: number;
  counter: number;
  totalAmount: number;
  payAmount: number;
  goods: IDataShoppingGoods[];
}

export interface IResponseShoppingTemp extends GenericResponse {
  response: IDataShoppingTemp;
}

export interface IResponseShoppingTemps extends GenericResponse {
  response: IDataShoppingTemp[];
}
