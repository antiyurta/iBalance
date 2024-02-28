import { api } from "@/feature/interceptor/interceptor";
import {
  IPosDocumentDto,
  IResponsePosDocument,
  IResponsePosDocuments,
} from "./entites";
import { GenericResponse, IParam } from "@/service/entities";
import { IResponseDocument } from "../entities";

function get(params?: IParam): Promise<IResponsePosDocuments> {
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
