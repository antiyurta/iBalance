import { api } from "@/feature/interceptor/interceptor";
import { IResponseBalance, IDataBalance, IParamBalance } from "./entities";

function get(params?: IParamBalance): Promise<IResponseBalance> {
  return api.get("material-balance", { params });
}

function post(body: IDataBalance): Promise<IResponseBalance> {
  return api.post("material-balance", body);
}
function patch(id: number, body: IDataBalance): Promise<IResponseBalance> {
  return api.patch(`material-balance/${id}`, body);
}

export const BalanceService = {
  get,
  post,
  patch,
};

