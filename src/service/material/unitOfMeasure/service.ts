import { api } from "../../../feature/interceptor/interceptor";
import { IUnitOfMeasureResponse, IParams } from "./entities";

function get(params: IParams): Promise<IUnitOfMeasureResponse> {
  return api.get("reference-measurement", { params: params });
}

export const UnitOfMeasureService = {
  get,
};
