import { api } from "@/feature/interceptor/interceptor";
import {
  CreateTempDto,
  IResponseShoppingTemp,
  IResponseShoppingTemps,
} from "./entities";
import { GenericResponse } from "@/service/entities";

function get(): Promise<IResponseShoppingTemps> {
  return api.get("pos-temp");
}
function post(body: CreateTempDto): Promise<IResponseShoppingTemp> {
  return api.post("pos-temp", body);
}

function empty(id: number): Promise<GenericResponse> {
  return api.delete(`pos-temp/empty/${id}`);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`pos-temp/${id}`);
}

export const ShoppingTempService = {
  get,
  post,
  empty,
  remove,
};
