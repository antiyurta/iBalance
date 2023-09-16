import { api } from "@/feature/interceptor/interceptor";
import {
  IMemmershipResponse,
  IMembershipsResponse,
  IDataMembership,
  Params,
} from "./entities";

function get(params: Params): Promise<IMembershipsResponse> {
  return api.get("reference-membership", { params });
}
function getById(id: number): Promise<IMemmershipResponse> {
  return api.get("reference-membership/" + id);
}
function post(body: IDataMembership): Promise<IMemmershipResponse> {
  return api.post("reference-membership", body);
}

function remove(id: number): Promise<IMembershipsResponse> {
  return api.delete("reference-membership/" + id);
}

function patch(
  id: number,
  body: IDataMembership
): Promise<IMemmershipResponse> {
  return api.patch("reference-membership/" + id, body);
}
export const MembershipService = {
  get,
  getById,
  post,
  patch,
  remove,
};
