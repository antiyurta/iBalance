import { api } from "@/feature/interceptor/interceptor";
import {
  IDataShoppingCartPost,
  IResponseShoppingCart,
  IResponseShoppingCarts,
} from "./entities";

function get(): Promise<IResponseShoppingCarts> {
  return api.get("pos-shopping-cart");
}
function post(body: IDataShoppingCartPost): Promise<IResponseShoppingCart> {
  return api.post("pos-shopping-cart", body);
}

function patch(
  id: number,
  body: {
    quantity: number;
  }
): Promise<IResponseShoppingCart> {
  return api.patch("pos-shopping-cart/" + id, body);
}

function remove(id: number): Promise<IResponseShoppingCart> {
  return api.delete("pos-shopping-cart/" + id);
}

export const ShoppingCartService = {
  get,
  post,
  patch,
  remove,
};
