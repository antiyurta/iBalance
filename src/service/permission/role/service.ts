import { api } from "@/feature/interceptor/interceptor";
import {
  IDataRole,
  IParamRole,
  IResponseRole,
  IResponseRoles,
} from "./entities";
import { GenericResponse } from "@/service/entities";

function get(params: IParamRole): Promise<IResponseRoles> {
  return api.get("warehouse-permission/role", { params });
}

function getById(id: number): Promise<IResponseRole> {
  return api.get(`warehouse-permission/role/${id}`);
}

function post(body: IDataRole): Promise<IResponseRole> {
  return api.post("warehouse-permission/role", body);
}
function patch(id: number, body: IDataRole): Promise<IResponseRole> {
  return api.patch(`warehouse-permission/role/${id}`, body);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`warehouse-permission/role/${id}`);
}

export const RoleService = {
  get,
  getById,
  post,
  patch,
  remove,
};
