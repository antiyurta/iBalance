import { api } from "@/feature/interceptor/interceptor";
import { IParamPos, IResponsePointOfSales, IResponsePos } from "./entities";

function get(params: IParamPos): Promise<IResponsePointOfSales> {
  return api.get("point-of-sale", { params });
}
function getById(id: number): Promise<IResponsePos> {
  return api.get(`point-of-sale/${id}`);
}
// function post(body: CreateShoppingCartDto): Promise<IResponseShoppingCart> {
//   return api.post("point-of-sale", body);
// }

// function patch(
//   id: string,
//   body: UpdateShoppingCartDto
// ): Promise<IResponseShoppingCart> {
//   return api.patch(`point-of-sale/${id}`, body);
// }

// function remove(id: string): Promise<IResponseShoppingCart> {
//   return api.delete("point-of-sale/" + id);
// }

export const PosService = {
  get,
  getById,
  // post,
  // patch,
  // remove,
};
