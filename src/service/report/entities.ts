import { Dayjs } from "dayjs";
import { GenericResponse, Tool } from "../entities";

export interface IReportMaterial {
  warehouseName?: string;
  code?: string;
  name?: string;
  sectionName?: string;
  isActive?: boolean;
  shortName?: string;
  refundQty?: number; // SALE_RETURN
  purchaseQty?: number; // PURCHASE
  warehouseIncomeQty?: number; // WAREHOUSE, CONVERSION, MIXTURE
  cencusIncomeQty?: number; // CENCUS
  saleQty?: number; // SALE POS
  operationQty?: number; // OPERATION
  purchaseReturnQty?: number; // PURCHASE_RETURN
  actQty?: number; // ACT
  warehouseExpenseQty?: number; // WAREHOUSE, CONVERSION, MIXTURE
  cencusExpenseQty?: number; // CENCUS
  beginingQty?: number;
  incomeQty?: number;
  expenseQty?: number;
  lastQty?: number;
}
export interface IParamReportMaterial {
  dateFilter: {
    operator: Tool;
    startAt: Dayjs;
    endAt: Dayjs;
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
