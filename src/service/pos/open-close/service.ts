import { api } from "@/feature/interceptor/interceptor";
import {
  ICloseDto,
  IOpenDto,
  IParamOpenClose,
  IResponsePosOpenClose,
  IResponsePosOpenClosers,
} from "./entities";
/** Өдрийн нээлт хаалтын түүх */
function get(params: IParamOpenClose): Promise<IResponsePosOpenClosers> {
  return api.get("pos-open-close", { params });
}
function getById(id: number): Promise<IResponsePosOpenClose> {
  return api.get(`pos-open-close/${id}`);
}
/** Посс нээлт хийх */
function postOpen(body: IOpenDto): Promise<IResponsePosOpenClose> {
  return api.post("pos-open-close", body);
}
/** Посс хаалт хийх */
function patchClose(
  id: number,
  body: ICloseDto
): Promise<IResponsePosOpenClose> {
  return api.patch(`pos-open-close/${id}`, body);
}
export const OpenCloseService = {
  get,
  getById,
  postOpen,
  patchClose,
};
