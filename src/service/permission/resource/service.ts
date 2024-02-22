import { api } from "@/feature/interceptor/interceptor";
import {
  IDataResource,
  IParamResource,
  IResponseResource,
  IResponseResources
} from "./entities";
import { GenericResponse } from "@/service/entities";

function getAll(params?: IParamResource): Promise<IResponseResources> {
  return api.get("warehouse-permission/resource", { params });
}
function get(params?: IParamResource): Promise<IResponseResources> {
  return api.get("warehouse-permission/resource/tree", { params });
}
function post(body: IDataResource): Promise<IResponseResource> {
  return api.post("warehouse-permission/resource", body);
}
function patch(id: number, body: IDataResource): Promise<IResponseResource> {
  return api.patch(`warehouse-permission/resource/${id}`, body);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`warehouse-permission/resource/${id}`);
}

export const ResourceService = {
  getAll,
  get,
  post,
  patch,
  remove,
};
