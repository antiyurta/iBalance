import { GenericResponse, Meta, Quearies } from "@/service/entities";

export interface Params {
  cardNo?: string[];
  name?: string[];
  isSave?: boolean[];
  isTotalAmount?: boolean[];
  isPercent?: boolean[];
  discount?: number[];
  limitDiscount?: number[];
  description?: string[];
  createdBy?: number[];
  queries?: Quearies[];
}

export interface IDataMembership {
  id: number;
  cardNo: string;
  name: string;
  isSave: boolean;
  isTotalAmount: boolean;
  isPercent: boolean;
  discount: number;
  limitDiscount: number;
  description: string;
  createdBy: number;
  createdAt: string;
  updatedBy: number;
  updatedAt: string;
  deletedAt: string;
}

export interface IMemmershipResponse extends GenericResponse {
  response: IDataMembership;
}

export interface IMembershipsResponse extends GenericResponse {
  response: {
    data: IDataMembership[],
    meta: Meta;
    filter: Params;
  };
}
