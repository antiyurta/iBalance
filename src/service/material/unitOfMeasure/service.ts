import { IParam } from "@/service/entities";
import { api } from "../../../feature/interceptor/interceptor";
import {
  IUnitOfMeasureResponse,
  IParamUnitOfMeasure,
  IUnitOfMeasurePostResponse,
  IDataUnitOfMeasure,
  IResponseMeasure,
} from "./entities";
function getHeader(): Promise<IResponseMeasure> {
  return api.get("reference-measurement/header/query");
}
function get(params?: IParam): Promise<IUnitOfMeasureResponse> {
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
  getHeader,
  get,
  post,
  patch,
  remove,
};
