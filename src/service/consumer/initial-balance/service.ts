import { api } from "@/feature/interceptor/interceptor";
import {
  IInputInitialBalance,
  IResponseInitialBalance,
  IParamInitialBalance,
} from "./entities";

function get(params: IParamInitialBalance): Promise<IResponseInitialBalance> {
  return api.get("initial-balance", { params: params });
}

function post(body: IInputInitialBalance): Promise<IResponseInitialBalance> {
  return api.post("initial-balance", body);
}

function remove(id: number): Promise<IResponseInitialBalance> {
  return api.delete(`initial-balance/${id}`);
}

export const initialBalanceService = {
  get,
  post,
  remove,
};
