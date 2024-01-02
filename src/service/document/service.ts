import { api } from "@/feature/interceptor/interceptor";
import {
  IDataDocument,
  IParamDocument,
  IPosDocumentDto,
  IResponseDocument,
  IResponseDocumentCode,
  IResponseDocuments,
} from "./entities";

function get(params: IParamDocument): Promise<IResponseDocuments> {
  return api.get("transaction-document", { params });
}
function getById(id: number): Promise<IResponseDocument> {
  return api.get(`transaction-document/${id}`);
}
function generateCode(): Promise<IResponseDocumentCode> {
  return api.get("transaction-document/generate/code");
}
function post(body: IDataDocument): Promise<IResponseDocument> {
  return api.post("transaction-document", body);
}
function postMove(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/move", body);
}
function postConversion(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/conversion", body);
}
function postMixture(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/mixture", body);
}
function postCensus(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/census", body);
}
function postPosDocument(body: IPosDocumentDto): Promise<IResponseDocument> {
  return api.post("pos-document", body);
}
function patch(id: number, body: IDataDocument): Promise<IResponseDocuments> {
  return api.patch(`transaction-document/${id}`, body);
}
function lock(ids: number[], isLock: boolean): Promise<IResponseDocument> {
  return api.put("transaction-document", { ids, isLock });
}
function remove(id: number): Promise<IResponseDocument> {
  return api.delete(`transaction-document/${id}`);
}
function removePosDocument(
  id: number,
  description: string
): Promise<IResponseDocument> {
  return api.patch(`pos-document/${id}`, { description });
}
export const DocumentService = {
  get,
  getById,
  generateCode,
  post,
  postMove,
  postConversion,
  postMixture,
  postCensus,
  postPosDocument,
  patch,
  lock,
  remove,
  removePosDocument,
};
