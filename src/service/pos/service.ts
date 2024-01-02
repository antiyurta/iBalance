import { api } from "@/feature/interceptor/interceptor";
import {
  ICreatePos,
  IDataPos,
  IParamPos,
  IResponsePointOfSales,
  IResponsePos,
} from "./entities";

function get(params: IParamPos): Promise<IResponsePointOfSales> {
  return api.get("point-of-sale", { params });
}
function getById(id: number): Promise<IResponsePos> {
  return api.get(`point-of-sale/${id}`);
}
function post(body: ICreatePos): Promise<IResponsePos> {
  return api.post("point-of-sale", body);
}
function patch(id: number, body: ICreatePos): Promise<IResponsePos> {
  return api.patch(`point-of-sale/${id}`, body);
}

function remove(id: number): Promise<IResponsePos> {
  return api.delete("point-of-sale/" + id);
}

export const PosService = {
  get,
  getById,
  post,
  patch,
  remove,
};
