import { api } from "../../feature/interceptor/interceptor";
import {
  IResponseConsumer,
  IDataConsumer,
  IParamConsumer,
  IConsumerResponseUpdate,
} from "./entities";
function get(params: IParamConsumer): Promise<IResponseConsumer> {
  return api.get("consumer", { params: params });
}
function post(body: IDataConsumer): Promise<IResponseConsumer> {
  return api.post("consumer", body);
}
function patch(
  id: number,
  body: IDataConsumer
): Promise<IConsumerResponseUpdate> {
  return api.patch("consumer/" + id, body);
}

function switchPatch(body: {
  sectionId: number;
  ids: number[];
}): Promise<IResponseConsumer> {
  return api.patch("consumer", body);
}

function remove(id: number): Promise<IResponseConsumer> {
  return api.delete("consumer/" + id);
}
export const ConsumerService = {
  get,
  post,
  patch,
  switchPatch,
  remove,
};
