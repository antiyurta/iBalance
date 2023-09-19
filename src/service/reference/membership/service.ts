import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseMembership,
  IDataMembership,
  IParamMembership,
  IInputMembership,
} from "./entities";

function get(params: IParamMembership): Promise<IResponseMembership> {
  return api.get("reference-membership", { params });
}
function getById(id: number): Promise<IResponseMembership> {
  return api.get("reference-membership/" + id);
}
function post(body: IInputMembership): Promise<IResponseMembership> {
  return api.post("reference-membership", body);
}

function remove(id: number): Promise<IResponseMembership> {
  return api.delete("reference-membership/" + id);
}

function patch(
  id: number,
  body: IInputMembership
): Promise<IResponseMembership> {
  return api.patch("reference-membership/" + id, body);
}
export const MembershipService = {
  get,
  getById,
  post,
  patch,
  remove,
};
