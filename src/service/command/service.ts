import { api } from "../../feature/interceptor/interceptor";
import { GenericResponse } from "../entities";
import {
  IDataCommand,
  IParamCommand,
  IResponseCommand,
  IResponseOneCommand,
} from "./entities";

function get(params: IParamCommand): Promise<IResponseCommand> {
  return api.get("material-command", { params });
}
function getById(id: number): Promise<IResponseOneCommand> {
  return api.get(`material-command/${id}`);
}
function postPrice(body: IDataCommand): Promise<IResponseOneCommand> {
  return api.post("material-command/price", body);
}
function postDiscount(body: IDataCommand): Promise<IResponseOneCommand> {
  return api.post("material-command/discount", body);
}
function postCoupon(body: IDataCommand): Promise<IResponseOneCommand> {
  return api.post("material-command/coupon", body);
}

function patchPrice(id: number, body: IDataCommand): Promise<IResponseOneCommand> {
  return api.patch(`material-command/price/${id}`, body);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`material-command/${id}`);
}

export const MaterialCommandService = {
  get,
  getById,
  postPrice,
  postDiscount,
  postCoupon,
  patchPrice,
  remove,
};
