import { api } from "@/feature/interceptor/interceptor";
import {
  IInputConsumerMembership,
  IResponseConsumerMembership,
  IParamConsumerMembership,
  IResponseConsumerMemberships,
} from "./entities";
import { GenericResponse } from "@/service/entities";

function get(
  params: IParamConsumerMembership
): Promise<IResponseConsumerMemberships> {
  return api.get("consumer-member-ship", { params: params });
}
function getById(id: number): Promise<IResponseConsumerMembership> {
  return api.get(`consumer-member-ship/${id}`);
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
function remove(consumerId: number): Promise<GenericResponse> {
  return api.delete(`consumer-member-ship/${consumerId}`);
}
export const ConsumerMembershipService = {
  get,
  getById,
  post,
  patch,
  remove,
};
