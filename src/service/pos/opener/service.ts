import { api } from "@/feature/interceptor/interceptor";
import { IDataPosOpener, IResponseOpenCheck } from "./entities";

function getCheckOpen(): Promise<IResponseOpenCheck> {
  return api.get("pos-opener/check", {
    params: {
      date: new Date(),
    },
  });
}
function post(body: IDataPosOpener): Promise<IResponseOpenCheck> {
  return api.post("pos-opener", body);
}
export const OpenerService = {
  getCheckOpen,
  post,
};
