import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseViewMaterial,
  IParamViewMaterial,
  IResponseViewMaterialOne,
} from "./entities";

function get(params: IParamViewMaterial): Promise<IResponseViewMaterial> {
  return api.get("view-material", { params });
}
function getById(
  id: number,
  warehouseId?: number
): Promise<IResponseViewMaterialOne> {
  return api.get("view-material/by", { params: { id, warehouseId } });
}

export const ViewMaterialService = { get, getById };
