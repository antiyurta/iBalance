import { api } from "../../feature/interceptor/interceptor";
import {
  IDataBooking,
  IParamBooking,
  IResponseBookings,
  IResponseBooking,
} from "./entities";

function get(params: IParamBooking): Promise<IResponseBookings> {
  return api.get("booking", { params });
}
function getById(id: number): Promise<IResponseBooking> {
  return api.get(`booking/${id}`);
}
function postSale(body: IDataBooking): Promise<IResponseBooking> {
  return api.post("booking/sale", body);
}
function postLocal(body: IDataBooking): Promise<IResponseBooking> {
  return api.post("booking/local", body);
}
function patchDistribute(id: number, body: IDataBooking): Promise<IResponseBooking> {
  return api.patch(`booking/distribute/${id}`, body);
}
function patchConfirm(id: number, body: IDataBooking): Promise<IResponseBooking> {
  return api.patch(`booking/confirm/${id}`, body);
}

export const BookingService = {
  get,
  getById,
  postSale,
  postLocal,
  patchDistribute,
  patchConfirm,
};
