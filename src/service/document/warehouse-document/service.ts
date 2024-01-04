import { api } from "@/feature/interceptor/interceptor";
import {
  IDataWarehouseDocument,
  IParamWarehouseDocument,
  IResponseDocument,
  IResponseDocuments,
} from "./entities";

function get(params: IParamWarehouseDocument): Promise<IResponseDocuments> {
  return api.get("transaction-warehouse-document", { params });
}
function getById(id: number): Promise<IResponseDocument> {
  return api.get(`transaction-warehouse-document/${id}`);
}
function post(body: IDataWarehouseDocument): Promise<IResponseDocument> {
  return api.post("transaction-warehouse-document", body);
}
function patch(
  id: number,
  body: IDataWarehouseDocument
): Promise<IResponseDocuments> {
  return api.patch(`transaction-warehouse-document/${id}`, body);
}
function remove(id: number): Promise<IResponseDocument> {
  return api.delete(`transaction-warehouse-document/${id}`);
}
export const WarehouseDocumentService = { get, getById, post, patch, remove };
