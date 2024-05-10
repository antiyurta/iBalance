import { api } from "@/feature/interceptor/interceptor";
import {
  IParamReportClosure,
  IResponseReportClosures,
  IResponseReportClosure,
  IDataReportClosure,
} from "./entities";

function get(params?: IParamReportClosure): Promise<IResponseReportClosures> {
  return api.get("/warehouse-report-closure", { params });
}
function getById(id: number): Promise<IResponseReportClosures> {
  return api.get("/warehouse-report-closure/" + id);
}
function post(data: IDataReportClosure): Promise<IResponseReportClosure> {
  return api.post("/warehouse-report-closure", data);
}
function patch(
  id: number,
  data: IDataReportClosure
): Promise<IResponseReportClosure> {
  return api.patch("/warehouse-report-closure/" + id, data);
}
function remove(id: number): Promise<IResponseReportClosures> {
  return api.get("/warehouse-report-closure/" + id);
}
export const ReportClosureService = { get, getById, post, patch, remove };
