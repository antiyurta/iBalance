import { api } from "@/feature/interceptor/interceptor";
import {
  IInputInitialBalance,
  IResponseInitialBalance,
  IParamInitialBalance,
  IResponseInitialBalanceUpdate,
} from "./entities";

function get(params: IParamInitialBalance): Promise<IResponseInitialBalance> {
  return api.get("initial-balance", { params: params });
}

function getById(id: number): Promise<IResponseInitialBalanceUpdate> {
  return api.get("initial-balance/" + id);
}

function post(body: IInputInitialBalance): Promise<IResponseInitialBalance> {
  return api.post("initial-balance", body);
}

function patch(
  id: number,
  body: IInputInitialBalance
): Promise<IResponseInitialBalanceUpdate> {
  return api.patch(`initial-balance/${id}`, body);
}

function remove(id: number): Promise<IResponseInitialBalance> {
  return api.delete(`initial-balance/${id}`);
}

export const initialBalanceService = {
  get,
  getById,
  post,
  patch,
  remove,
};
