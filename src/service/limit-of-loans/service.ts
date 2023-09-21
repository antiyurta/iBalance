import { api } from "../../feature/interceptor/interceptor";
import {
  IInputLimitOfLoans,
  ILimitOfLoansResponse,
  ILimitOfLoansResponseUpdate,
  IParamLimitOfLoans,
} from "./entities";

function get(params: IParamLimitOfLoans): Promise<ILimitOfLoansResponse> {
  return api.get("lend-limit", { params: params });
}

function getById(id: number): Promise<ILimitOfLoansResponseUpdate> {
  return api.get("lend-limit/" + id);
}

function post(body: IInputLimitOfLoans): Promise<ILimitOfLoansResponse> {
  return api.post("lend-limit", body);
}
function patch(
  id: number,
  body: IInputLimitOfLoans
): Promise<ILimitOfLoansResponseUpdate> {
  return api.patch("lend-limit/" + id, body);
}
function remove(id: number): Promise<ILimitOfLoansResponse> {
  return api.delete("lend-limit/" + id);
}
export const limitOfLoansService = {
  get,
  getById,
  post,
  patch,
  remove,
};
