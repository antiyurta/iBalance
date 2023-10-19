
import { api } from "@/feature/interceptor/interceptor";
import { IParamDiscount, IResponseDiscount } from "./entities";

function get(params: IParamDiscount): Promise<IResponseDiscount> {
  return api.get("material-discount", { params });
}

export const MaterialDiscountService = { get };
