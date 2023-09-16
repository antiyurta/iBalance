import { api } from "@/feature/interceptor/interceptor";
import {
  ITreeSectionOneResponse,
  ITreeSectionResponse,
  IDataTreeSection,
  Params,
  TreeSectionType,
} from "./entities";

function get(type: TreeSectionType): Promise<ITreeSectionResponse> {
  return api.get("tree-section", {
    params: {
      type: type,
    },
  });
}
function getById(id: number): Promise<ITreeSectionOneResponse> {
  return api.get("tree-section/" + id);
}
function getByFilter(params: Params): Promise<ITreeSectionResponse> {
  return api.get("tree-section", {
    params: params,
  });
}
function post(body: IDataTreeSection): Promise<ITreeSectionResponse> {
  return api.post("tree-section", body);
}

function remove(id: number | undefined): Promise<ITreeSectionResponse> {
  return api.delete("tree-section/" + id);
}

function patch(
  id: number | undefined,
  body: IDataTreeSection
): Promise<ITreeSectionResponse> {
  return api.patch("tree-section/" + id, body);
}
export const TreeSectionService = {
  get,
  getById,
  getByFilter,
  post,
  patch,
  remove,
};
