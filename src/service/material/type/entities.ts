import { GenericResponse, IFilters, Meta } from "../../entities";

export interface IParams {
  page?: number | undefined;
  limit?: number | undefined;
}

export interface IDataType {
  accountNo: string;
  createdAt: string;
  id: number;
  name: string;
  updatedAt: string;
}

export interface ITypeResponse extends GenericResponse {
  response: {
    data: IDataType[];
    meta: Meta;
    filter: IFilters;
  };
}

// export interface IConsumerResponseUpdate extends GenericResponse {
//   response: IDataMaterial;
// }
