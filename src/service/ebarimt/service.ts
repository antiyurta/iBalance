import { api } from "@/feature/interceptor/interceptor";
import { EBarimtResponse } from "./entities";

function getOrganizationInfo(regno: number): Promise<EBarimtResponse> {
  return api.get(`ebarimt/organization/${regno}`);
}
export const EbarimtService = {
  getOrganizationInfo,
};
