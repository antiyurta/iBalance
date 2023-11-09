import { api } from "@/feature/interceptor/interceptor";
import { IDataDocument, IParamDocument, IResponseDocument, IResponseDocuments } from "./entities";

function get(params: IParamDocument): Promise<IResponseDocuments> {
  return api.get("transaction-document", { params });
}

function post(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document", body);
}

function patch(id: number, body: IDataDocument): Promise<IResponseDocuments> {
  return api.patch(`transaction-document/${id}`, body);
}

function remove(id: number): Promise<IResponseDocument> {
    return api.delete(`transaction-document/${id}`);
}
export const ReferenceService = { get, post, patch, remove };
