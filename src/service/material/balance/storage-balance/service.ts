import { api } from "@/feature/interceptor/interceptor";
import { IParamStorageBalance, IResponseStorageBalance } from "./entites";

function get(params?: IParamStorageBalance): Promise<IResponseStorageBalance> {
  return api.get("material-storage-balance", { params });
}
export const storageBalanceService = { get };
