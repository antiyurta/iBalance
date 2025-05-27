import { IDataPrice } from "../command/price/entities";
import {
  ColumnType,
  GenericResponse,
  IColumn,
  IDataFile,
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
import { IDataCoupon } from "../command/coupon/entities";
import { IDataDiscount } from "../command/discount/entities";
import { IDataResourceSize } from "./resource-size/entities";
import { IDataTransaction } from "../document/transaction/entities";

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
  isExpired: boolean;
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
  resourceSizes: IDataResourceSize[];
  prices: IDataPrice[];
  discounts: IDataDiscount[];
  coupons: IDataCoupon[];
  minResourceSize: number;
  minDownloadSize: number;
  // TODO refunds: Refund[];
  // TODO bookingMaterials: BookingMaterial[];
  transactions: IDataTransaction[];
  memberships: IDataMembership[]; // бэлгийн карт
  fileIds: number[];
  files: IDataFile[];
  price: IDataPrice;
}
export interface IFilterMaterial extends IColumn {
  code?: string;
  materialId?: number;
  measurementId?: number;
  materialSectionId?: number[];
  countPackage?: number;
  brandId?: number;
  rankId?: number;
  isActive?: boolean[];
  description?: string;
  name?: string;
  barCode?: string[];
  serial?: string;
  unitCodeId?: string;
  unitCode?: IDataUnitCode;
  isCitizenTax?: boolean;
  isTax?: boolean;
  minResourceSize?: number;
  minDownloadSize?: number;
  balanceQty?: number;
}

export type FilteredColumnsMaterial = {
  [T in keyof IFilterMaterial]?: ColumnType;
};

export interface IParamMaterial extends IParam, IFilterMaterial {
  types?: MaterialType[]; // төрөл
  ids?: number[];
  isResourceSizeRel?: boolean;
  isBalanceRel?: boolean;
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
