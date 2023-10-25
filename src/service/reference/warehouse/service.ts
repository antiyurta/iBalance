import { GenericResponse } from "@/service/entities";
import { api } from "../../../feature/interceptor/interceptor";
import {
  IResponseWarehouses,
  IResponseWarehouse,
  IDataWarehouse,
  IParamWarehouse,
} from "./entities";
function get(params: IParamWarehouse): Promise<IResponseWarehouses> {
  return api.get("warehouse", { params });
}
function post(body: IDataWarehouse): Promise<IResponseWarehouse> {
  return api.post("warehouse", body);
}
function patch(
  id: number,
  body: IDataWarehouse
): Promise<IResponseWarehouse> {
  return api.patch("warehouse/" + id, body);
}

function remove(id: number): Promise<GenericResponse> {
  return api.delete("warehouse/" + id);
}
export const WarehouseService = {
  get,
  post,
  patch,
  remove,
};
