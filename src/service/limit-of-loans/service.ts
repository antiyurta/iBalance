import { api } from "../../feature/interceptor/interceptor";
import { IDataLimitOfLoans, ILimitOfLoansResponse, Params } from "./entities";

function get(params: Params): Promise<ILimitOfLoansResponse> {
  return api.get("lend-limit", { params: params });
}
function post(body: IDataLimitOfLoans): Promise<ILimitOfLoansResponse> {
  return api.post("lend-limit", body);
}
export const limitOfLoansService = {
  get,
  post,
};
