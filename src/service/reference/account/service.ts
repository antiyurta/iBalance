import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseAccount,
  IResponseAccounts,
  IDataReferenceAccount,
  IParamReferenceAccount,
} from "./entities";

function get(params: IParamReferenceAccount): Promise<IResponseAccounts> {
  return api.get("receivable-account", { params });
}
function getById(id: number): Promise<IResponseAccount> {
  return api.get(`receivable-account/${id}`);
}
function post(body: IDataReferenceAccount): Promise<IResponseAccount> {
  return api.post("receivable-account", body);
}

function remove(id: number): Promise<IResponseAccount> {
  return api.delete(`receivable-account/${id}`);
}

function patch(
  id: number,
  body: IDataReferenceAccount
): Promise<IResponseAccount> {
  return api.patch(`receivable-account/${id}`, body);
}
export const referenceAccountService = {
  get,
  getById,
  post,
  patch,
  remove,
};
