import { GenericResponse } from "@/service/entities";
import { IDataShoppingCart } from "../shopping-card/entities";

export interface IDataShoppingGoods {
  id: number;
  materialQuantity: number;
  quantity: number;
  shoppingCarts: IDataShoppingCart[];
}

export interface IDataShoppingGoodsPost {
  shoppingCartIds?: number[];
}

export interface IResponseShoppingGoods extends GenericResponse {
  response: IDataShoppingGoods[];
}
