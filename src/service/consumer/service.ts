import { api } from "../../feature/interceptor/interceptor";
import {
  IConsumerResponse,
  IConsumerResponseUpdate,
  IDataConsumer,
  Params,
} from "./entities";

function get(params: Params): Promise<IConsumerResponse> {
  return api.get("consumer", { params: params });
}
function post(body: IDataConsumer): Promise<IConsumerResponse> {
  return api.post("consumer", body);
}
function patch(
  id: number | undefined,
  body: IDataConsumer
): Promise<IConsumerResponseUpdate> {
  return api.patch("consumer/" + id, body);
}
function remove(id: number): Promise<IConsumerResponse> {
  return api.delete("consumer/" + id);
}
export const ConsumerService = {
  get,
  post,
  patch,
  remove,
};
