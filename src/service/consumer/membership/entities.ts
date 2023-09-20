import { Dayjs } from "dayjs";
import { ColumnType, GenericResponse, IParam, Meta } from "../../entities";
import { IDataConsumer } from "../entities";
import { IDataMembership } from "@/service/reference/membership/entities";

export interface IDataConsumerMembership {
  id: number;
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
export interface IFilterConsumerMembership {
  consumerCode?: string[];
  consumerLastname?: string[];
  consumerName?: string[];
  consumerIsIndividual?: boolean[];
  consumerPhone?: string[];
  consumerIsActive?: boolean[];
  consumerRegno?: string[];
  membershipCardno?: string[];
  membershipName?: string[];
}
export type FilteredColumnsMembership = {
  [T in keyof IFilterConsumerMembership]?: ColumnType;
};
export interface IParamConsumerMembership
  extends Meta,
    IParam,
    IFilterConsumerMembership {}
export interface IResponseConsumerMembership extends GenericResponse {
  response: {
    data: IDataConsumerMembership[];
    meta: Meta;
    filter: IFilterConsumerMembership;
  };
}
