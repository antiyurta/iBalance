import { api } from "../../feature/interceptor/interceptor";
import {
  IDataMaterial,
  IMaterialResponse,
  IParams,
  IUnitCodeResponse,
} from "./entities";

function get(params: IParams): Promise<IMaterialResponse> {
  return api.get("material", { params: params });
}

function getUnitCode(): Promise<IUnitCodeResponse> {
  return api.get("material-unit-code");
}

function post(body: IDataMaterial): Promise<IMaterialResponse> {
  return api.post("material", body);
}

export const MaterialService = {
  get,
  getUnitCode,
  post,
};
