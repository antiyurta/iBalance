import { api } from "@/feature/interceptor/interceptor";
import {
  IDataInitialBalance,
  IDataInitialBalancePost,
  IinitialBalanceResponse,
  Params,
} from "./entities";

function get(params: Params): Promise<IinitialBalanceResponse> {
  return api.get("initial-balance", { params: params });
}

function post(body: IDataInitialBalancePost): Promise<IinitialBalanceResponse> {
  return api.post("initial-balance", body);
}

function remove(id: number): Promise<IinitialBalanceResponse> {
  return api.get("initial-balance/" + id);
}

export const initialBalanceService = {
  get,
  post,
  remove,
};
