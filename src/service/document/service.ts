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
function getById(id: number): Promise<IResponseDocument> {
  return api.get(`transaction-document/${id}`);
}

function postIncome(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/income", body);
}
function postRefund(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/refund", body);
}
function postSale(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/sale", body);
}
function postOperation(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/in-operation", body);
}
function postAct(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/act", body);
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
function postPurchaseReturn(body: IDataDocument): Promise<IResponseDocuments> {
  return api.post("transaction-document/purchase-return", body);
}
function patch(id: number, body: IDataDocument): Promise<IResponseDocuments> {
  return api.patch(`transaction-document/${id}`, body);
}

function remove(id: number): Promise<IResponseDocument> {
  return api.delete(`transaction-document/${id}`);
}
export const DocumentService = {
  get,
  getById,
  postIncome,
  postRefund,
  postSale,
  postOperation,
  postAct,
  postMove,
  postConversion,
  postMixture,
  postCensus,
  postPurchaseReturn,
  patch,
  remove,
};
