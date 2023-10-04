import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseViewMaterial,
  IParamViewMaterial,
} from "./entities";

function get(params: IParamViewMaterial): Promise<IResponseViewMaterial> {
  return api.get("view-material", { params });
}

export const ViewMaterialService = { get };
