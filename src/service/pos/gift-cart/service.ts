import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseGiftCarts,
  IResponseGiftCart,
  IParamGiftCart,
  ICreateGiftCart,
  IParamBalanceGift,
  IResponseBalanceGift,
} from "./entities";

function get(params: IParamGiftCart): Promise<IResponseGiftCarts> {
  return api.get("gift-cart", { params });
}
function balance(params: IParamBalanceGift): Promise<IResponseBalanceGift> {
  return api.get("gift-cart/balance", { params });
}
function post(body: ICreateGiftCart): Promise<IResponseGiftCart> {
  return api.post("gift-cart", body);
}
function patch(body: {
  code: string;
  shoppingCartId?: string;
}): Promise<IResponseGiftCart> {
  return api.patch("gift-cart", body);
}

export const GiftCartService = { get, balance, post, patch };
