import {
  GenericResponse,
  IFilter,
  IFilters,
  IParam,
  Meta,
  ColumnType,
} from "../../entities";

export interface IDataType {
  accountNo: string;
  createdAt: string;
  id: number;
  name: string;
  updatedAt: string;
}

export interface IFilterMaterialType extends IFilter {
  accountNo?: string;
  name?: string;
}

export type FilteredColumnsMaterialType = {
  [T in keyof IFilterMaterialType]?: ColumnType;
};

export interface IParamMaterialType extends Meta, IParam, IFilterMaterialType {}

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
