import { api } from "@/feature/interceptor/interceptor";
import {
  CheckInvoiceDto,
  CreateInvoiceDto,
  GetInvoiceDto,
  IResponsePaymentInvoice,
  IResponsePaymentInvoices,
} from "./entities";

function get(params: GetInvoiceDto): Promise<IResponsePaymentInvoices> {
  return api.get("pos-invoice", { params });
}
function check(params: CheckInvoiceDto): Promise<IResponsePaymentInvoice> {
  return api.get("pos-invoice/check", { params });
}
function post(body: CreateInvoiceDto): Promise<IResponsePaymentInvoice> {
  return api.post("pos-invoice", body);
}
function remove(id: string): Promise<IResponsePaymentInvoice> {
  return api.delete(`pos-invoice/${id}`);
}

export const PosInvoiceService = {
  get,
  check,
  post,
  remove,
};
