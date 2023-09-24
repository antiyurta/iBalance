import { api } from "@/feature/interceptor/interceptor";
import {
  IParamCountry,
  IResponseCountry,
} from "./entities";

function get(params: IParamCountry): Promise<IResponseCountry> {
  return api.get("reference/country", { params });
}

export const CountyService = { get };
