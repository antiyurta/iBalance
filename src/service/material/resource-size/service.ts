import { api } from "@/feature/interceptor/interceptor";
import {
  IDataResourceSize,
  IResponseResourceSize,
  IResponseResourceSizes,
  IParamResourceSize,
} from "./entities";
import { GenericResponse } from "@/service/entities";

function get(params: IParamResourceSize): Promise<IResponseResourceSizes> {
  return api.get("material-resource-size", { params });
}

function getById(id: number): Promise<IResponseResourceSize> {
  return api.get("material-resource-size/" + id);
}

function post(body: IDataResourceSize): Promise<IResponseResourceSize> {
  return api.post("material-resource-size", body);
}

function patch(
  id: number,
  body: IDataResourceSize
): Promise<IResponseResourceSize> {
  return api.patch("material-resource-size/" + id, body);
}

function remove(materialId: number): Promise<GenericResponse> {
  return api.delete("material-resource-size/" + materialId);
}

export const MaterialResourceSizeService = {
  get,
  getById,
  post,
  patch,
  remove,
};
