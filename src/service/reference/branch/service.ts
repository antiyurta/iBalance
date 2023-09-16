import { api } from "../../../feature/interceptor/interceptor";
import { IBranchResponse, IDataBranch, Params } from "./entities";
function get(params: Params): Promise<IBranchResponse> {
  return api.get("branch", { params });
}
function post(body: IDataBranch): Promise<IBranchResponse> {
  return api.post("branch", body);
}
function patch(
  id: number | undefined,
  body: IDataBranch
): Promise<IBranchResponse> {
  return api.patch("branch/" + id, body);
}

function remove(id: number): Promise<IBranchResponse> {
  return api.delete("branch/" + id);
}
export const BranchService = {
  get,
  post,
  patch,
  remove,
};
