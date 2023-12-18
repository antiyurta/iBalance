import { api } from "@/feature/interceptor/interceptor";
import {
  IParamMoneyTransaction,
  IResponseMoneyTransactions,
  IResponseMoneyTransaction,
  IDataMoneyTransaction,
} from "./entities";
/** мөнгө нэмэх хасах шилжүүлэх */
function get(
  params: IParamMoneyTransaction
): Promise<IResponseMoneyTransactions> {
  return api.get("pos-money-transaction", { params });
}
function post(body: IDataMoneyTransaction): Promise<IResponseMoneyTransaction> {
  return api.post("pos-money-transaction", body);
}
function transfer(id: number): Promise<IResponseMoneyTransaction> {
  return api.patch(`pos-money-transaction/${id}`);
}
export const MoneyTransactionService = { get, post, transfer };
