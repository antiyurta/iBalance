import { GenericResponse, IDataFile, Meta } from "@/service/entities";
import { IDataType } from "../type/entities";
import { MaterialType } from "../entities";

export interface IParamMaterialSection {
  type: MaterialType;
  materialAccountId?: number[];
  sectionId?: number[];
  isExpand?: boolean;
  isSale?: boolean[];
}

export interface IDataMaterialSection {
  id: number;
  sectionId: number;
  sections: IDataMaterialSection[];
  name: string;
  isExpand: boolean;
  isSale: boolean;
  type: MaterialType;
  materialAccountId: number;
  materialAccount?: IDataType;
  fileId?: number;
  file?: IDataFile;
}

export interface IMaterialSectionOneResponse extends GenericResponse {
  response: IDataMaterialSection;
}

export interface IMaterialSectionResponse extends GenericResponse {
  response: {
    data: IDataMaterialSection[];
    meta: Meta;
  };
}
