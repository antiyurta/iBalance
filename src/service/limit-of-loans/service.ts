import { api } from "../../feature/interceptor/interceptor";
import {
  IDataLimitOfLoansPost,
  ILimitOfLoansResponse,
  Params,
} from "./entities";

function get(params: Params): Promise<ILimitOfLoansResponse> {
  return api.get("lend-limit", { params: params });
}
function post(body: IDataLimitOfLoansPost): Promise<ILimitOfLoansResponse> {
  return api.post("lend-limit", body);
}
function patch(
  id: number | undefined,
  body: IDataLimitOfLoansPost
): Promise<ILimitOfLoansResponse> {
  return api.patch("lend-limit/" + id, body);
}
export const limitOfLoansService = {
  get,
  post,
  patch,
};
