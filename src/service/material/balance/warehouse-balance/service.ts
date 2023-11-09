import { api } from "@/feature/interceptor/interceptor";
import { IParamWarehouseBalance, IResponseStorageBalance } from "./entites";

function get(params?: IParamWarehouseBalance): Promise<IResponseStorageBalance> {
  return api.get("material-warehouse-balance", { params });
}
export const WarehouseBalanceService = { get };
