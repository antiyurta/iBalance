import { api } from "@/feature/interceptor/interceptor";
import { IResponseBalanceAccount, IParamBalanceAccount } from "./entities";

function get(params: IParamBalanceAccount): Promise<IResponseBalanceAccount> {
  return api.get("balance-account", { params: params });
}

export const balanceAccountService = {
  get,
};
