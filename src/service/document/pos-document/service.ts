import { api } from "@/feature/interceptor/interceptor";
import {
  IParamPosDocument,
  IPosDocumentDto,
  IResponsePosDocument,
  IResponsePosDocuments,
} from "./entites";
import { GenericResponse } from "@/service/entities";

function get(params?: IParamPosDocument): Promise<IResponsePosDocuments> {
  return api.get("pos-document", { params });
}
function getById(id: number): Promise<IResponsePosDocument> {
  return api.get(`pos-document/${id}`);
}
function post(body: IPosDocumentDto): Promise<IResponsePosDocument> {
  return api.post("pos-document", body);
}
function remove(id: number): Promise<GenericResponse> {
  return api.delete(`consumer/${id}`);
}
export const PosDocumentService = { get, getById, post, remove };
