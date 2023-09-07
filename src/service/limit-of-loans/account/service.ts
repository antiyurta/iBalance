import { api } from "@/feature/interceptor/interceptor";
import { Params } from "../entities";
import { ILimitOfLoansAccountResponse } from "./entities";

function get(params: Params): Promise<ILimitOfLoansAccountResponse> {
  return api.get("lend-limit-account", { params: params });
}
export const limitOfLoansAccountService = {
  get,
};
