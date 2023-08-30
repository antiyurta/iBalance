import { api } from "@/feature/interceptor/interceptor";
import { IConsumerSectionResponse, Params } from "./entities";

function get(): Promise<IConsumerSectionResponse> {
  return api.get("consumer-section");
}
function getById(id: number): Promise<IConsumerSectionResponse> {
  return api.get("consumer-section/" + id);
}
function getByFilter(params: Params): Promise<IConsumerSectionResponse> {
  return api.get("consumer-section", {
    params: params,
  });
}
export const ConsumerSectionService = {
  get,
  getById,
  getByFilter,
};
