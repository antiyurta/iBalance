import { api } from "../../feature/interceptor/interceptor";
import { IDataConfigCode, IResponseConfigCode } from "./entities";
function get(): Promise<IResponseConfigCode> {
  return api.get("config-code");
}
function post(body: IDataConfigCode): Promise<IResponseConfigCode> {
  return api.post("config-code", body);
}
export const ConfigCodeService = { get, post };
