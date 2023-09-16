import { GenericResponse, IFilters, Meta } from "../entities";

export interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  //   name?: string[];
  //   sectionId?: string[] | number[];
  //   isAccount?: boolean[];
  //   limitAmount?: number[];
  //   isClose?: boolean[];
  //   isActive?: boolean[];
  //   updatedAt?: string[];
  //   updatedBy?: number[];
  //   queries?: Quearies[];
  //   orderParam?: string | null | undefined;
  //   order?: RadioType | null | undefined;
}

export interface IDataMembershipCard {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface IMembershipCardResponse extends GenericResponse {
  response: {
    data: IDataMembershipCard[];
    meta: Meta;
    filter: IFilters;
  };
}
