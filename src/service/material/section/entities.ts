import { GenericResponse, IDataFile, Meta } from "@/service/entities";

export interface IParamMaterialSection {
  materialTypeId?: number[];
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
  materialTypeId: number;
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
