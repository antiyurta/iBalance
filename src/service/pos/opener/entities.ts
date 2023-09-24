import { GenericResponse } from "@/service/entities";
import { Dayjs } from "dayjs";

export interface IDataPosBankNote {
  posOpenerId: number;
  sectionMoneyId: number;
  quantity: number;
  amount: number;
}

export interface IDataPosOpener {
  date: Dayjs;
  isBankNote: boolean;
  amount: number;
  posBankNotes: IDataPosBankNote;
}

export interface IResponseOpenCheck extends GenericResponse {
  response: boolean;
}
