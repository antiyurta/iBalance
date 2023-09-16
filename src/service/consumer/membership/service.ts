import { api } from "@/feature/interceptor/interceptor";
import { IInputConsumerMembership, IResponseConsumerMembership, Params } from "./entities";

function get(params: Params): Promise<IResponseConsumerMembership> {
  return api.get("consumer-member-ship", { params: params });
}
function post(body: IInputConsumerMembership): Promise<IResponseConsumerMembership> {
  return api.post('consumer-member-ship', body);
}
function patch(consumerId: number, body: IInputConsumerMembership): Promise<IResponseConsumerMembership> {
  return api.patch(`consumer-member-ship/${consumerId}`, body);
}
export const ConsumerMembershipService = {
  get,
  post,
  patch
};
