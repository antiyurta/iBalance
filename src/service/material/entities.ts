import { IDataPrice } from "../command/price/entities";
import {
  ColumnType,
  GenericResponse,
  IDataFile,
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
import { IDataViewMaterial } from "./view-material/entities";

// Материалын төрөл
export enum MaterialType {
  Material = "MATERIAL", // Бараа
  Service = "SERVICE", // Үйлчилгээ
  Package = "PACKAGE", // Багц
}

interface IDataPackageMaterial {
  materialId: number;
  material: IDataMaterial;
  quantity: number;
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
  materials: IDataViewMaterial[]; // Багцад орох материалуудыг сетлэх
  balances: IDataBalance[];
  packageMaterials: IDataPackageMaterial[];
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
  files: IDataFile[];
  price: IDataPrice;
}
export interface IFilterMaterial extends IFilter {
  code?: string;
  materialId?: number;
  measurementId?: number;
  materialSectionId?: number[];
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

export interface IParamMaterial extends Meta, IParam, IFilterMaterial {
  types?: MaterialType[]; // төрөл
  ids?: number[];
}

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
