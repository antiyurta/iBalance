import { api } from "@/feature/interceptor/interceptor";
import { IDataShoppingGoodsPost, IResponseShoppingGoods } from "./entites";

function get(): Promise<IResponseShoppingGoods> {
  return api.get("pos-shopping-goods");
}
function post(body: IDataShoppingGoodsPost): Promise<IResponseShoppingGoods> {
  return api.post("pos-shopping-goods", body);
}
function patch(id: number): Promise<IResponseShoppingGoods> {
  return api.patch("pos-shopping-goods/" + id);
}
function remove(id: number): Promise<IResponseShoppingGoods> {
  return api.delete("pos-shopping-goods/" + id);
}

export const ShoppingGoodsService = {
  get,
  post,
  patch,
  remove,
};
