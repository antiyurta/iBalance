import { api } from "@/feature/interceptor/interceptor";
import { IDataType, IParamMaterialType, ITypeResponse } from "./entities";

function get(params?: IParamMaterialType): Promise<ITypeResponse> {
  return api.get("material-type", { params: params });
}

function post(body: IDataType): Promise<ITypeResponse> {
  return api.post("material-type", body);
}

function patch(
  id: number | undefined,
  body: IDataType
): Promise<ITypeResponse> {
  return api.patch("material-type/" + id, body);
}

function remove(id: number): Promise<ITypeResponse> {
  return api.delete("material-type/" + id);
}

export const TypeService = {
  get,
  post,
  patch,
  remove,
};
