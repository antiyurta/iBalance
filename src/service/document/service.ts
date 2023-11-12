import { api } from "@/feature/interceptor/interceptor";
import {
  IDataDocument,
  IParamDocument,
  IResponseDocument,
  IResponseDocuments,
} from "./entities";

function get(params: IParamDocument): Promise<IResponseDocuments> {
  return api.get("transaction-document", { params });
}

function postIncome(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/income", body);
}
function postRefund(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/refund", body);
}

function patch(id: number, body: IDataDocument): Promise<IResponseDocuments> {
  return api.patch(`transaction-document/${id}`, body);
}

function remove(id: number): Promise<IResponseDocument> {
  return api.delete(`transaction-document/${id}`);
}
export const DocumentService = { get, postIncome, postRefund, patch, remove };
