import { api } from "@/feature/interceptor/interceptor";
import { IBrandResponse, IDataBrand, IParams } from "./entities";

function get(params?: IParams): Promise<IBrandResponse> {
  return api.get("brand", { params: params });
}

function post(body: IDataBrand): Promise<IBrandResponse> {
  return api.post("brand", body);
}

export const BrandService = {
  get,
  post,
};
