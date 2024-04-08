import { api } from "@/feature/interceptor/interceptor";
import {
  IDataDocument,
  IParamDocument,
  IResponseAllDocument,
  IResponseDocument,
  IResponseDocumentCode,
  IResponseDocuments,
} from "./entities";

function get(params: IParamDocument): Promise<IResponseAllDocument> {
  return api.get("transaction-document", { params });
}
function getById(id: number): Promise<IResponseDocument> {
  return api.get(`transaction-document/${id}`);
}
function getByCode(code: string): Promise<IResponseDocuments> {
  return api.get(`transaction-document/show/${code}`);
}
function generateCode(params?: IParamDocument): Promise<IResponseDocumentCode> {
  return api.get("transaction-document/generate/code", { params });
}
function post(body: IDataDocument): Promise<IResponseDocument> {
  return api.post("transaction-document", body);
}
function postMove(body: IDataDocument): Promise<IResponseAllDocument> {
  return api.post("transaction-document/move", body);
}
function postConversion(body: IDataDocument): Promise<IResponseAllDocument> {
  return api.post("transaction-document/conversion", body);
}
function postMixture(body: IDataDocument): Promise<IResponseAllDocument> {
  return api.post("transaction-document/mixture", body);
}
function patch(id: number, body: IDataDocument): Promise<IResponseAllDocument> {
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
  getByCode,
  generateCode,
  post,
  postMove,
  postConversion,
  postMixture,
  patch,
  lock,
  remove,
  removePosDocument,
};
