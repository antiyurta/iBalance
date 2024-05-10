import { api } from "@/feature/interceptor/interceptor";
import {
  IParamReportMaterial,
  IResponseReportEndatMaterial,
  IResponseReportMaterial,
} from "./entities";

function reportMaterial(
  params?: IParamReportMaterial
): Promise<IResponseReportMaterial> {
  return api.get("warehouse-report/material", { params });
}
function reportEndatMaterial(
  params?: IParamReportMaterial
): Promise<IResponseReportEndatMaterial> {
  return api.get("warehouse-report/material-endat", { params });
}
export const ReportService = { reportMaterial, reportEndatMaterial };
