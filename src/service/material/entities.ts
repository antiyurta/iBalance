import { GenericResponse, IFilters, Meta } from "../entities";
import { IDataReference } from "../reference/entity";
import { IDataBalance } from "./balance/entities";
import { IDataBrand } from "./brand/entities";
import { IDataMaterialSection } from "./section/entities";
import { IDataUnitOfMeasure } from "./unitOfMeasure/entities";

export interface IParamMaterial {
  page?: number | undefined;
  limit?: number | undefined;
  code?: number[] | undefined;
  materialSectionId?: number[] | string[];
}

export interface IDataUnitCode {
  id: number;
  code: string;
  name: string;
}

export interface IDataMaterial {
  id: number;
  code: string;
  materialId: number;
  material: IDataMaterial;
  measurementId: number;
  measurement: IDataUnitOfMeasure;
  materialSectionId: number;
  section: IDataMaterialSection;
  countPackage: number;
  brandId: number;
  brand: IDataBrand;
  rankId: number;
  rank: IDataReference;
  isActive: boolean;
  description: string;
  name: string;
  barCode: string;
  serial: string;
  unitCodeId: string;
  unitCode: IDataUnitCode;
  isCitizenTax: boolean;
  isTax: boolean;
  createdAt: string;
  updatedAt: string;
  materials: IDataMaterial[];
  balances: IDataBalance[];
  // TODO
  fileIds: number[];

}

export interface IUnitCodeResponse extends GenericResponse {
  response: {
    data: IDataUnitCode[];
    meta: Meta;
  };
}

export interface IMaterialResponse extends GenericResponse {
  response: {
    data: IDataMaterial[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IConsumerResponseUpdate extends GenericResponse {
  response: IDataMaterial;
}
