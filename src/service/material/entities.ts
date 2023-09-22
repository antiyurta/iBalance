import { IDataPrice } from "../command/price/entities";
import {
  ColumnType,
  GenericResponse,
  IFilter,
  IFilters,
  IParam,
  Meta,
} from "../entities";
import { IDataReference } from "../reference/entity";
import { IDataMembership } from "../reference/membership/entities";
import { IDataBalance } from "./balance/entities";
import { IDataBrand } from "./brand/entities";
import { IDataMaterialSection } from "./section/entities";
import { IDataUnitOfMeasure } from "./unitOfMeasure/entities";

// Материалын төрөл
export enum MaterialType {
  Material = "MATERIAL", // Бараа
  Service = "SERVICE", // Үйлчилгээ
  Package = "PACKAGE", // Багц
}
export interface IDataUnitCode {
  id: number;
  code: string;
  name: string;
}

export interface IDataMaterial {
  id: number;
  type: MaterialType; // төрөл
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
  // TODO resourceSizes: ResourceSize[];
  prices: IDataPrice[];
  // TODO discounts: Discount[];
  // TODO coupons: Coupon[];
  // TODO materialCoupons: Coupon[];
  // TODO refunds: Refund[];
  // TODO bookingMaterials: BookingMaterial[];
  // TODO transactions: Transaction[];
  memberships: IDataMembership[]; // бэлгийн карт
  fileIds: number[];
  price: IDataPrice;
}
export interface IFilterMaterial extends IFilter {
  type?: MaterialType; // төрөл
  code?: string;
  materialId?: number;
  measurementId?: number;
  materialSectionId?: number;
  countPackage?: number;
  brandId?: number;
  rankId?: number;
  isActive?: boolean;
  description?: string;
  name?: string;
  barCode?: string;
  serial?: string;
  unitCodeId?: string;
  unitCode?: IDataUnitCode;
  isCitizenTax?: boolean;
  isTax?: boolean;
}

export type FilteredColumnsMaterial = {
  [T in keyof IFilterMaterial]?: ColumnType;
};

export interface IParamMaterial extends Meta, IParam, IFilterMaterial {}

export interface IResponseUnitCode extends GenericResponse {
  response: {
    data: IDataUnitCode[];
    meta: Meta;
  };
}

export interface IResponseMaterial extends GenericResponse {
  response: {
    data: IDataMaterial[];
    meta: Meta;
    filter: IFilters;
  };
}

export interface IResponseOneMaterial extends GenericResponse {
  response: IDataMaterial;
}
