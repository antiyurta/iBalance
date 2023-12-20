import { api } from "@/feature/interceptor/interceptor";
import {
  CreateGoodsDto,
  IResponseShoppingGood,
  IResponseShoppingGoods,
  UpdateGoodstDto,
} from "./entites";

function get(): Promise<IResponseShoppingGoods> {
  return api.get("pos-shopping-goods");
}
function post(body: CreateGoodsDto): Promise<IResponseShoppingGood> {
  return api.post("pos-shopping-goods", body);
}
function patch(
  id: number,
  body: UpdateGoodstDto
): Promise<IResponseShoppingGood> {
  return api.patch(`pos-shopping-goods/${id}`, body);
}
function remove(id: number): Promise<IResponseShoppingGood> {
  return api.delete(`pos-shopping-goods/${id}`);
}

export const ShoppingGoodsService = {
  get,
  post,
  patch,
  remove,
};
