import { api } from "@/feature/interceptor/interceptor";
import { IConsumerSectionResponse, Params } from "./entities";

function get(): Promise<IConsumerSectionResponse> {
  return api.get("tree-section");
}
function getById(id: number): Promise<IConsumerSectionResponse> {
  return api.get("tree-section/" + id);
}
function getByFilter(params: Params): Promise<IConsumerSectionResponse> {
  return api.get("tree-section", {
    params: params,
  });
}
export const ConsumerSectionService = {
  get,
  getById,
  getByFilter,
};
