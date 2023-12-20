import { api } from "@/feature/interceptor/interceptor";
import {
  ICreatePosRefund,
  IParamPosRefund,
  IResponsePosRefund,
  IResponsePosRefunds,
} from "./entities";
/** Өдрийн нээлт хаалтын түүх */
function get(params: IParamPosRefund): Promise<IResponsePosRefunds> {
  return api.get("pos-refund", { params });
}
/** Посс буцаалт хийх */
function post(body: ICreatePosRefund): Promise<IResponsePosRefund> {
  return api.post("pos-refund", body);
}
export const PosRefundService = { get, post };
