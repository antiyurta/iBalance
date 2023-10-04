import { ColumnType, IData, IParam, Meta } from "../entities";

export type PeriodType = "year" | "month" | "quarter";

export interface IDataCurrentPeriodCloseOff extends IData {
  id: number;
}

export interface IFilterCurrentPeriodCloseOff {
  barimtNo: number;
  period: PeriodType;
  reportPeriod: string;
  closingStatus: boolean;
  updatedBy: string;
  updatedAt: string;
}

export type FilteredColumnsCurrentPeriodCloseOff = {
  [T in keyof IFilterCurrentPeriodCloseOff]?: ColumnType;
};

export interface IParamCurrentPeriodCloseOff
  extends IFilterCurrentPeriodCloseOff,
    Meta,
    IParam {}
