import { api } from "@/feature/interceptor/interceptor";
import { IResponseReportMaterial } from "./entities";

function reportMaterial(params?: any): Promise<IResponseReportMaterial> {
  return api.get("warehouse-report/material", { params });
}
export const ReportService = { reportMaterial };
