import { api } from "@/feature/interceptor/interceptor";
import { IDataBrand, IParamBrand, IResponseBrand, IResponseOneBrand } from "./entities";

function get(params?: IParamBrand): Promise<IResponseBrand> {
  return api.get("brand", { params });
}

function post(body: IDataBrand): Promise<IResponseOneBrand> {
  return api.post("brand", body);
}
function patch(id: number, body: IDataBrand): Promise<IResponseOneBrand> {
  return api.patch(`brand/${id}`, body);
}
function remove(id: number): Promise<IResponseOneBrand> {
  return api.delete(`brand/${id}`);
}

export const BrandService = { get, post, patch, remove };
