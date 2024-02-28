import { api } from "@/feature/interceptor/interceptor";
import {
  GetInvoiceDto,
  IDataPaymentInvoice,
  IResponsePaymentInvoice,
  IResponsePaymentInvoices,
} from "./entities";

function get(params: GetInvoiceDto): Promise<IResponsePaymentInvoices> {
  return api.get("pos-invoice", { params });
}
function post(body: IDataPaymentInvoice): Promise<IResponsePaymentInvoice> {
  return api.post("pos-invoice", body);
}
function remove(id: string): Promise<IResponsePaymentInvoice> {
  return api.delete(`pos-invoice/${id}`);
}

export const PosInvoiceService = {
  get,
  post,
  remove,
};
