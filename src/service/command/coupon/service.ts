
import { api } from "@/feature/interceptor/interceptor";
import { IParamCoupon, IResponseCoupon } from "./entities";

function get(params?: IParamCoupon): Promise<IResponseCoupon> {
  return api.get("material-coupon", { params });
}

export const MaterialCouponService = { get };
