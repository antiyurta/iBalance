import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseUnitCode,
  IResponseOneUnitCode,
  IDataUnitCode,
  IParamUnitCode,
} from "./entities";

function get(params: IParamUnitCode): Promise<IResponseUnitCode> {
  return api.get("material-unit-code", { params });
}
function getById(id: number): Promise<IResponseOneUnitCode> {
  return api.get(`material-unit-code/${id}`);
}

export const UnitCodeService = { get, getById };
