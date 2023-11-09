import { api } from "@/feature/interceptor/interceptor";
import {
  IDataTransaction,
  IParamTransaction,
  IResponseTransaction,
  IResponseTransactions,
} from "./entities";

function get(params: IParamTransaction): Promise<IResponseTransactions> {
  return api.get("transaction", { params });
}

function post(body: IDataTransaction): Promise<IResponseTransaction> {
  return api.post("transaction", body);
}

function patch(
  id: number,
  body: IDataTransaction
): Promise<IResponseTransaction> {
  return api.patch(`transaction/${id}`, body);
}

function remove(id: number): Promise<IResponseTransaction> {
  return api.delete(`transaction/${id}`);
}
export const TransactionService = { get, post, patch, remove };
