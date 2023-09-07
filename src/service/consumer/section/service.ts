import { api } from "@/feature/interceptor/interceptor";
import {
  IConsumerSectionResponse,
  IDataConsumerSection,
  Params,
  TreeSectionType,
} from "./entities";

function get(type: TreeSectionType): Promise<IConsumerSectionResponse> {
  return api.get("tree-section", {
    params: {
      type: type,
    },
  });
}
function getById(id: number): Promise<IConsumerSectionResponse> {
  return api.get("tree-section/" + id);
}
function getByFilter(params: Params): Promise<IConsumerSectionResponse> {
  return api.get("tree-section", {
    params: params,
  });
}
function post(body: IDataConsumerSection): Promise<IConsumerSectionResponse> {
  return api.post("tree-section", body);
}
export const ConsumerSectionService = {
  get,
  getById,
  getByFilter,
  post,
};
