import { api } from "@/feature/interceptor/interceptor";
import { IbalanceAccountResponse, Params } from "./entities";

function get(params: Params): Promise<IbalanceAccountResponse> {
  return api.get("balance-account", { params: params });
}

function remove(id: number): Promise<IbalanceAccountResponse> {
  return api.get("initial-balance/" + id);
}

export const balanceAccountService = {
  get,
  remove,
};
