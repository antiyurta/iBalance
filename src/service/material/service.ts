import { api } from "../../feature/interceptor/interceptor";
import { GenericResponse } from "../entities";
import {
  IDataMaterial,
  IResponseMaterial,
  IParamMaterial,
  IResponseOneMaterial,
} from "./entities";

function get(params: IParamMaterial): Promise<IResponseMaterial> {
  return api.get("material", { params });
}

function post(body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.post("material", body);
}
function postService(body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.post("material/service", body);
}
function patch(id: number, body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.patch(`material/${id}`, body);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`material/${id}`);
}

export const MaterialService = { get, post, postService, patch, remove };
