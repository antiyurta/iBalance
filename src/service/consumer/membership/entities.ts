import {
  GenericResponse,
  IFilters,
  Meta,
  Quearies,
  RadioType,
} from "../../entities";
import { IDataConsumer } from "../entities";

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  consumerCode?: string[];
  consumerLastname?: string[];
  consumerName?: string[];
  consumerIsIndividual?: boolean[];
  consumerPhone?: string[];
  consumerIsActive?: boolean[];
  consumerRegno?: string[];
  membershipCardno?: string[];
  membershipName?: string[];
  queries?: Quearies[];
  orderParam?: string | null | undefined;
  order?: RadioType | null | undefined;
}

export interface IDataConsumerMembership {
  id: number;
  membershipId: number;
  consumerId: number;
  branchId: number;
  amount: number;
  endAt: string;
  isClose: boolean;
  consumer: IDataConsumer;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}
export interface IInputConsumerMembership {
  consumerId: number;
  cards: IDataConsumerMembership[],
}

export interface IResponseConsumerMembership extends GenericResponse {
  response: {
    data: IDataConsumerMembership[];
    meta: Meta;
    filter: IFilters;
  };
}
