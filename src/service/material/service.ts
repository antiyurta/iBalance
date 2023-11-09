import { api } from "../../feature/interceptor/interceptor";
import { GenericResponse } from "../entities";
import {
  IDataMaterial,
  IResponseMaterial,
  IParamMaterial,
  IResponseOneMaterial,
} from "./entities";

function get(params?: IParamMaterial): Promise<IResponseMaterial> {
  return api.get("material", { params });
}

function getById(id: number): Promise<IResponseOneMaterial> {
  return api.get("material/" + id);
}

function post(body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.post("material", body);
}
function postService(body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.post("material/service", body);
}
function postPackage(body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.post("material/package", body);
}
function patch(id: number, body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.patch(`material/${id}`, body);
}
function patchPackage(
  id: number,
  body: IDataMaterial
): Promise<IResponseOneMaterial> {
  return api.patch(`material/package/${id}`, body);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`material/${id}`);
}

function switchPatch(body: {
  materialSectionId: number;
  ids: number[];
}): Promise<any> {
  return api.patch("material", body);
}

export const MaterialService = {
  get,
  getById,
  post,
  postService,
  postPackage,
  patch,
  patchPackage,
  remove,
  switchPatch,
};
