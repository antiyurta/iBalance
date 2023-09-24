import { api } from "@/feature/interceptor/interceptor";
import { IDataBrand, IParamBrand, IResponseBrand, IResponseOneBrand } from "./entities";

function get(params: IParamBrand): Promise<IResponseBrand> {
  return api.get("brand", { params });
}

function post(body: IDataBrand): Promise<IResponseOneBrand> {
  return api.post("brand", body);
}

export const BrandService = { get, post };
