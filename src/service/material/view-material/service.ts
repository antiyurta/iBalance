import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseViewMaterial,
  IParamViewMaterial,
  IResponseViewMaterialOne,
} from "./entities";

function get(params: IParamViewMaterial): Promise<IResponseViewMaterial> {
  return api.get("view-material", { params });
}
function getById(id: number): Promise<IResponseViewMaterialOne> {
  return api.get("view-materia/" + id);
}

export const ViewMaterialService = { get, getById };
