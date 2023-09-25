import { api } from "@/feature/interceptor/interceptor";
import {
  ILimitOfLoansAccountResponse,
  IParamLimitOFloansAccount,
} from "./entities";

function get(
  params: IParamLimitOFloansAccount
): Promise<ILimitOfLoansAccountResponse> {
  return api.get("lend-limit-account", { params: params });
}
export const limitOfLoansAccountService = {
  get,
};
