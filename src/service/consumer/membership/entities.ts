import { Dayjs } from "dayjs";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IParam,
  Meta,
} from "../../entities";
import { IDataConsumer } from "../entities";
import { IDataMembership } from "@/service/reference/membership/entities";

export interface IDataConsumerMembership {
  id: number;
  cardno: string;
  membershipId: number;
  consumerId: number;
  branchId: number;
  amount: number;
  endAt: Dayjs;
  isClose: boolean;
  consumer: IDataConsumer;
  membership: IDataMembership;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}
export interface IInputConsumerMembership {
  consumerId: number;
  cards: IDataConsumerMembership[];
}
export interface IFilterConsumerMembership extends IColumn {
  phoneOrRegno?: string;
  consumerCode?: string[];
  consumerLastname?: string[];
  consumerName?: string[];
  consumerIsIndividual?: boolean[];
  consumerPhone?: string[];
  consumerIsActive?: boolean[];
  consumerIsEmployee?: boolean[];
  consumerSectionId?: number[];
  consumerEmail?: string[];
  consumerAddress?: string[];
  consumerRegno?: string[];
  consumerBank?: string[];
  consumerBankAccountNo?: string[];
  cardno?: string[];
  membershipName?: string[];
  branch?: number[];
  isClose?: boolean[];
  endAt?: string;
}
export type FilteredColumnsConsumerMembership = {
  [T in keyof IFilterConsumerMembership]?: ColumnType;
};
export interface IParamConsumerMembership
  extends IParam,
    IFilterConsumerMembership {}
export interface IResponseConsumerMemberships extends GenericResponse {
  response: {
    data: IDataConsumerMembership[];
    meta: Meta;
    filter: IFilterConsumerMembership;
  };
}
export interface IResponseConsumerMembership extends GenericResponse {
  response: IDataConsumerMembership;
}
