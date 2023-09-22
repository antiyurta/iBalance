import { GenericResponse } from "@/service/entities";
import { api } from "../../../feature/interceptor/interceptor";
import {
  IResponseBranch,
  IDataBranch,
  IParamBranch,
  IResponseOneBranch,
} from "./entities";
function get(params: IParamBranch): Promise<IResponseBranch> {
  return api.get("branch", { params });
}
function post(body: IDataBranch): Promise<IResponseOneBranch> {
  return api.post("branch", body);
}
function patch(
  id: number | undefined,
  body: IDataBranch
): Promise<IResponseOneBranch> {
  return api.patch("branch/" + id, body);
}

function remove(id: number): Promise<GenericResponse> {
  return api.delete("branch/" + id);
}
export const BranchService = {
  get,
  post,
  patch,
  remove,
};
