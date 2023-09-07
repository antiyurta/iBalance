import { api } from "../../feature/interceptor/interceptor";
import {
  IDataReceivableAccount,
  IReceivableAccountResponse,
  IReceivableAccountResponseUpdate,
  Params,
} from "./entities";

function get(params: Params): Promise<IReceivableAccountResponse> {
  return api.get("receivable-account", { params: params });
}
function post(
  body: IDataReceivableAccount
): Promise<IReceivableAccountResponse> {
  return api.post("receivable-account", body);
}
function patch(
  id: number | undefined,
  body: IDataReceivableAccount
): Promise<IReceivableAccountResponseUpdate> {
  return api.patch("receivable-account/" + id, body);
}
function remove(id: number): Promise<IReceivableAccountResponse> {
  return api.delete("receivable-account/" + id);
}
export const ReceivableAccountService = {
  get,
  post,
  patch,
  remove,
};
