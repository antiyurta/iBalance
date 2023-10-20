import { api } from "@/feature/interceptor/interceptor";
import {
  IInputConsumerMembership,
  IResponseConsumerMembership,
  IParamConsumerMembership,
} from "./entities";

function get(
  params: IParamConsumerMembership
): Promise<IResponseConsumerMembership> {
  return api.get("consumer-member-ship", { params: params });
}
function post(
  body: IInputConsumerMembership
): Promise<IResponseConsumerMembership> {
  return api.post("consumer-member-ship", body);
}
function patch(
  body: IInputConsumerMembership
): Promise<IResponseConsumerMembership> {
  return api.patch("consumer-member-ship", body);
}
function remove(consumerId: number): Promise<IResponseConsumerMembership> {
  return api.delete(`consumer-member-ship/${consumerId}`);
}
export const ConsumerMembershipService = {
  get,
  post,
  patch,
  remove,
};
