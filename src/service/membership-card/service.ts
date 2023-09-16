import { api } from "@/feature/interceptor/interceptor";
import { IMembershipCardResponse, Params } from "./entities";

function get(params: Params): Promise<IMembershipCardResponse> {
  return api.get("receivable-account", { params: params });
}
export const MembershipCardService = {
  get,
};
