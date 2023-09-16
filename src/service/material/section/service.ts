import { api } from "@/feature/interceptor/interceptor";
import { IDataMaterialSection, IMaterialSectionResponse } from "./entities";

function get(): Promise<IMaterialSectionResponse> {
  return api.get("material-section");
}

function post(body: IDataMaterialSection): Promise<IMaterialSectionResponse> {
  return api.post("material-section", body);
}

export const MaterialSectionService = {
  get,
  post,
};
