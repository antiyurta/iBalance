import { Dayjs } from "dayjs";
export type FormTransaction = {
  materialId?: number;
  name?: string;
  measurement?: string;
  countPackage?: number;
  lastQty?: number;
  expenseQty?: number;
};
/** Баршлын хөдөлгөөн */
export type FormMoveWarehouseDocument = {
  code: string;
  documentAt: string | Dayjs;
  description: string; // гүйлгээний утга
  expenseWarehouseId: number;
  expenseEmployeeId?: number;
  incomeWarehouseId: number;
  incomeEmployeeId?: number;
  bookingId?: string;
  transactions: FormTransaction[];
};
