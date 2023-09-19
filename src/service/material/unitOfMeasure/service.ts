import { api } from "../../../feature/interceptor/interceptor";
import {
  IUnitOfMeasureResponse,
  IParamUnitOfMeasure,
  IUnitOfMeasurePostResponse,
  IDataUnitOfMeasure,
} from "./entities";

function get(params: IParamUnitOfMeasure): Promise<IUnitOfMeasureResponse> {
  return api.get("reference-measurement", { params: params });
}
function post(body: IDataUnitOfMeasure): Promise<IUnitOfMeasurePostResponse> {
  return api.post("reference-measurement", body);
}

function patch(
  id: number | undefined,
  body: IDataUnitOfMeasure
): Promise<IUnitOfMeasurePostResponse> {
  return api.patch("reference-measurement/" + id, body);
}

function remove(id: number): Promise<IUnitOfMeasurePostResponse> {
  return api.delete("reference-measurement/" + id);
}

export const UnitOfMeasureService = {
  get,
  post,
  patch,
  remove,
};
