import { GenericResponse } from "../entities";

export interface IReportMaterial {
  code: string;
  isActive: boolean;
  name: string;
  shortName: string;
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
export interface IResponseReportMaterial extends GenericResponse {
  response: IReportMaterial[];
}