import { api } from "@/feature/interceptor/interceptor";
import { IResponseDocument, IResponseDocuments } from "./entities";
import { FormMoveWarehouseDocument } from "@/types/form";

function post(body: FormMoveWarehouseDocument): Promise<IResponseDocument> {
  return api.post("transaction-warehouse-document", body);
}
function patch(
  id: number,
  body: FormMoveWarehouseDocument
): Promise<IResponseDocuments> {
  return api.patch(`transaction-warehouse-document/${id}`, body);
}
function remove(id: number): Promise<IResponseDocument> {
  return api.delete(`transaction-warehouse-document/${id}`);
}
export const WarehouseDocumentService = { post, patch, remove };
