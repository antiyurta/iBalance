import { api } from "../../feature/interceptor/interceptor";
import { IMaterialResponse, IParams } from "./entities";

function get(params: IParams): Promise<IMaterialResponse> {
  return api.get("material", { params: params });
}

export const MaterialService = {
  get,
};
