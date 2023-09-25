import { IDataPrice } from "../command/price/entities";
import {
  ColumnType,
  GenericResponse,
  IFilter,
  IParam,
  Meta,
} from "../entities";
import { IDataReference } from "../reference/entity";
import { IDataMembership } from "../reference/membership/entities";
import { IDataUnitCode } from "../reference/unit-code/entities";
import { IDataBalance } from "./balance/entities";
import { IDataBrand } from "../reference/brand/entities";
import { IDataMaterialSection } from "./section/entities";
import { IDataUnitOfMeasure } from "./unitOfMeasure/entities";

// Материалын төрөл
export enum MaterialType {
  Material = "MATERIAL", // Бараа
  Service = "SERVICE", // Үйлчилгээ
  Package = "PACKAGE", // Багц
}
// Багцын материал
export interface IDataPackageMaterial {
  id: number;
  materialId: number;
  material: IDataMaterial;
  quantity: number;
}
// Материал дата
export interface IDataMaterial {
  id: number;
  type: MaterialType; // төрөл
  code: string;
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
  packageMaterials: IDataPackageMaterial[];
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

export interface IResponseMaterial extends GenericResponse {
  response: {
    data: IDataMaterial[];
    meta: Meta;
    filter: IFilterMaterial;
  };
}

export interface IResponseOneMaterial extends GenericResponse {
  response: IDataMaterial;
}
