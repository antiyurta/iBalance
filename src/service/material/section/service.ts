import { api } from "@/feature/interceptor/interceptor";
import { IDataMaterialSection, IMaterialSectionResponse, IParamMaterialSection } from "./entities";

function get(params: IParamMaterialSection): Promise<IMaterialSectionResponse> {
  return api.get("material-section", { params });
}

function post(body: IDataMaterialSection): Promise<IMaterialSectionResponse> {
  return api.post("material-section", body);
}

export const MaterialSectionService = {
  get,
  post,
};
