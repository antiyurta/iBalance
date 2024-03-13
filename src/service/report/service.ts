import { api } from "@/feature/interceptor/interceptor";
import { IParamReportMaterial, IResponseReportMaterial } from "./entities";

function reportMaterial(
  params?: IParamReportMaterial
): Promise<IResponseReportMaterial> {
  return api.get("warehouse-report/material", { params });
}
export const ReportService = { reportMaterial };
