import { GenericResponse, IData, IParam, Meta } from "@/service/entities";
import { IDataMaterial } from "@/service/material/entities";

export interface IDataShoppingCart extends IData {
  id: number;
  isSale: boolean;
  materialId: number;
  material: IDataMaterial;
  quantity: number;
  goodsId: number;
}

export interface IDataShoppingCartPost {
  materialId: number;
  quantity: number;
}

export interface IResponseShoppingCart extends GenericResponse {
  response: IDataShoppingCart;
}

export interface IResponseShoppingCarts extends GenericResponse {
  response: IDataShoppingCart[];
}
