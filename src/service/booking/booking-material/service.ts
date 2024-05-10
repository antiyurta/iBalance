import { api } from "@/feature/interceptor/interceptor";
import { IParamBookingMaterial, IResponseBookingMaterials } from "./entities";

function get(
  params?: IParamBookingMaterial
): Promise<IResponseBookingMaterials> {
  return api.get("booking-material", { params });
}

export const BookingMaterialService = { get };
