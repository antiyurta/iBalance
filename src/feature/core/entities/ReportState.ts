import { FilteredReport } from "@/service/entities";

export interface ReportState extends FilteredReport {}

export enum ReportActionType {
  SET_FILTER_VALUES = "SET_FILTER_VALUES",
}
