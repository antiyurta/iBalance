import { api } from "@/feature/interceptor/interceptor";
import {
  IResponsePaymentMethod,
  IResponsePaymentMethods,
  IDataReferencePaymentMethod,
  IParamPaymentMethod,
} from "./entities";

function get(params: IParamPaymentMethod): Promise<IResponsePaymentMethods> {
  return api.get("payment-method", { params });
}
function getById(id: number): Promise<IResponsePaymentMethod> {
  return api.get(`payment-method/${id}`);
}
function post(
  body: IDataReferencePaymentMethod
): Promise<IResponsePaymentMethod> {
  return api.post("payment-method", body);
}

function remove(id: number): Promise<IResponsePaymentMethod> {
  return api.delete(`payment-method/${id}`);
}

function patch(
  id: number,
  body: IDataReferencePaymentMethod
): Promise<IResponsePaymentMethod> {
  return api.patch(`payment-method/${id}`, body);
}
export const ReferencePaymentMethodService = {
  get,
  getById,
  post,
  patch,
  remove,
};
