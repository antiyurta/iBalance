import { api } from "@/feature/interceptor/interceptor";
import { IStorageResponse, IParamsStorage, IDataStorage } from "./entities";

function get(params: IParamsStorage): Promise<IStorageResponse> {
  return api.get("storage", { params: params });
}

function post(body: IDataStorage): Promise<IStorageResponse> {
  return api.post("storage", body);
}

export const StorageSerivce = {
  get,
  post,
};
