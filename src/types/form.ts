import { Dayjs } from "dayjs";
/** Байршлын хөдөлгөөн */
export type FormMoveWarehouseDocument = {
  code: string;
  documentAt: Dayjs;
  description: string; // гүйлгээний утга
  expenseWarehouseId: number;
  expenseEmployeeId?: number;
  incomeWarehouseId: number;
  incomeEmployeeId?: number;
  bookingId?: string;
  transactions: {
    materialId?: number;
    name?: string;
    measurement?: string;
    countPackage?: number;
    lastQty?: number;
    expenseQty?: number;
  }[];
};
/** Тооллого */
export type FormCensusDocument = {
  code: string;
  documentAt: Dayjs;
  warehouseId: number;
  employeeId: number;
  description: string;
  transactions: {
    materialId: number;
    name: string;
    measurement: string;
    countPackage: number;
    unitAmount: number;
    lastQty: number;
    isExpired: boolean;
    transactionAt: Dayjs;
    censusQty: number;
    diffQty: number;
    totalAmount: number;
    description: string;
  }[];
};
