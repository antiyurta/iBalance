import { GenericResponse, IData } from "@/service/entities";
import { IDataShoppingGoods } from "./goods/entites";

export interface CreateShoppingCartDto {
  goodsIds: number[];
}
export interface UpdateShoppingCartDto {
  consumerMembershipId: number;
  membershipDiscountAmount: number;
}

export interface IDataShoppingCart extends IData {
  id: string;
  currency: string;
  consumerMembershipId: number;
  quantity: number;
  totalAmount: number;
  membershipDiscountAmount: number;
  membershipIncreaseAmount: number;
  payAmount: number;
  goods: IDataShoppingGoods[];
}

export interface IResponseShoppingCart extends GenericResponse {
  response: IDataShoppingCart;
}

export interface IResponseShoppingCarts extends GenericResponse {
  response: IDataShoppingCart[];
}
