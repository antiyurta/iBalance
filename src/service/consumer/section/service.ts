import { api } from "@/feature/interceptor/interceptor";
import {
  IConsumerSectionOneResponse,
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
function getById(id: number): Promise<IConsumerSectionOneResponse> {
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

function remove(id: number | undefined): Promise<IConsumerSectionOneResponse> {
  return api.delete("tree-section/" + id);
}

function patch(
  id: number | undefined,
  body: IDataConsumerSection
): Promise<IConsumerSectionResponse> {
  return api.patch("tree-section/" + id, body);
}
export const ConsumerSectionService = {
  get,
  getById,
  getByFilter,
  post,
  patch,
  remove,
};
