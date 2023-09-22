import { api } from "../../feature/interceptor/interceptor";
import {
  IDataMaterial,
  IResponseMaterial,
  IParamMaterial,
  IResponseUnitCode,
  IResponseOneMaterial,
} from "./entities";

function get(params: IParamMaterial): Promise<IResponseMaterial> {
  return api.get("material", { params });
}

function getUnitCode(): Promise<IResponseUnitCode> {
  return api.get("material-unit-code");
}

function post(body: IDataMaterial): Promise<IResponseOneMaterial> {
  return api.post("material", body);
}

export const MaterialService = {
  get,
  getUnitCode,
  post,
};
