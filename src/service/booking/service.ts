import { api } from "../../feature/interceptor/interceptor";
import {
  IDataBooking,
  IParamBooking,
  IResponseBookings,
  IResponseBooking,
} from "./entities";

function get(params?: IParamBooking): Promise<IResponseBookings> {
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
function patch(id: string, body: IDataBooking): Promise<IResponseBooking> {
  return api.patch(`booking/${id}`, body);
}
function remove(id: number): Promise<IResponseBooking> {
  return api.patch(`booking/${id}`);
}

export const BookingService = {
  get,
  getById,
  postSale,
  postLocal,
  patch,
  remove,
};
