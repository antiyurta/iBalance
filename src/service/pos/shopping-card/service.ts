import { api } from "@/feature/interceptor/interceptor";
import {
  CreateShoppingCartDto,
  IResponseShoppingCart,
  IResponseShoppingCarts,
  UpdateShoppingCartDto,
} from "./entities";

function get(): Promise<IResponseShoppingCarts> {
  return api.get("pos-shopping-cart");
}
function getById(id: string): Promise<IResponseShoppingCart> {
  return api.get(`pos-shopping-cart/${id}`);
}
function post(body: CreateShoppingCartDto): Promise<IResponseShoppingCart> {
  return api.post("pos-shopping-cart", body);
}

function patch(
  id: string,
  body: UpdateShoppingCartDto
): Promise<IResponseShoppingCart> {
  return api.patch(`pos-shopping-cart/${id}`, body);
}

function remove(id: string): Promise<IResponseShoppingCart> {
  return api.delete("pos-shopping-cart/" + id);
}

export const ShoppingCartService = {
  get,
  getById,
  post,
  patch,
  remove,
};
