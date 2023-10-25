import { api } from "@/feature/interceptor/interceptor";
import {
  IDataMaterialSection,
  IMaterialSectionOneResponse,
  IMaterialSectionResponse,
  IParamMaterialSection,
} from "./entities";

function get(params: IParamMaterialSection): Promise<IMaterialSectionResponse> {
  return api.get("material-section", { params });
}

function getById(id: number): Promise<IMaterialSectionOneResponse> {
  return api.get("material-section/" + id);
}

function post(body: IDataMaterialSection): Promise<IMaterialSectionResponse> {
  return api.post("material-section", body);
}

function remove(id: number): Promise<IMaterialSectionResponse> {
  return api.delete("material-section/" + id);
}

export const MaterialSectionService = {
  get,
  getById,
  post,
  remove,
};
