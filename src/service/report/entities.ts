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
export interface IReportEndatMaterial {
  warehouseName?: string;
  code?: string;
  name?: string;
  sectionName?: string;
  shortName?: string;
  countPackage?: number;
  lastQty?: number; // Эцсийн үлдэгдэл
  expiredQty?: number; // Хугацаа дууссан
  noExpireQty?: number; // Хугацаа дуусаагүй
  monthExpireQty?: number; // 0-30 хоног
  twoMonthExpireQty?: number; // 31-60 хоног
  quarterExpireQty?: number; // 61-90 хоног
  halfYearQty?: number; // 91-180 хоног
  yearQty?: number; // 180-365 хоног
  moreYearQty?: number; // 365 хоногоос дээш
}
export interface IParamReportMaterial {
  dateFilter: {
    operator: Tool;
    startAt: Dayjs;
    endAt: Dayjs;
  };
  filterAt: Dayjs;
  isTransaction: boolean;
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
export interface IResponseReportEndatMaterial extends GenericResponse {
  response: IReportEndatMaterial[];
}
