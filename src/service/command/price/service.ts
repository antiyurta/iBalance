import { api } from "@/feature/interceptor/interceptor";
import {
  IParamPrice,
  IResponsePrice,
} from "./entities";
import { GenericResponse } from "@/service/entities";

function get(params: IParamPrice): Promise<IResponsePrice> {
  return api.get("material-price", { params });
}

export const MaterialPriceService = { get };
