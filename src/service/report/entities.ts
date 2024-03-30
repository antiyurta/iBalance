import { Dayjs } from "dayjs";
import { GenericResponse, Tool } from "../entities";

export interface IReportMaterial {
  code: string;
  isActive: boolean;
  name: string;
  shortName: string;
  warehouseName: string;
  materialSectionName: string;
  saleReturnQty: number;
  purchaseQty: number;
  warehouseIncomeQty: number;
  posQty: number;
  operationQty: number;
  purchaseReturnQty: number;
  actQty: number;
  warehouseExpenseQty: number;
  beginingQty: number;
  incomeQty: number;
  expenseQty: number;
  lastQty: number;
}
export interface IParamReportMaterial {
  dateFilter: {
    operator: Tool,
    startAt: Dayjs,
    endAt: Dayjs
  };
  isNotTransaction: boolean;
  isLock: boolean;
  employeeIds: number[];
  warehouseSectionId?: number;
  warehouseIds: number[];
  materialSectionId?: number;
  materialIds: number[];
  brandIds: number[];
  isWarehouse: boolean;
  isSection: boolean;
}
export interface IResponseReportMaterial extends GenericResponse {
  response: IReportMaterial[];
}