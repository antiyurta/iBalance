import { api } from "@/feature/interceptor/interceptor";
import {
  IDataMaterialAccount,
  IParamMaterialAccount,
  IResponseMaterialAccounts,
  IResponseMaterialAccount,
} from "./entities";

function get(
  params?: IParamMaterialAccount
): Promise<IResponseMaterialAccounts> {
  return api.get("material-account", { params: params });
}

function post(body: IDataMaterialAccount): Promise<IResponseMaterialAccount> {
  return api.post("material-account", body);
}

function patch(
  id: number | undefined,
  body: IDataMaterialAccount
): Promise<IResponseMaterialAccount> {
  return api.patch("material-account/" + id, body);
}

function remove(id: number): Promise<IResponseMaterialAccount> {
  return api.delete("material-account/" + id);
}

export const MaterialAccountService = {
  get,
  post,
  patch,
  remove,
};
