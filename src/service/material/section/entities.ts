import { GenericResponse, IDataFile, Meta } from "@/service/entities";

export interface IParamMaterialSection {
  sectionId?: number;
  isExpand?: boolean;
  isSale?: boolean[];
}

export interface IDataMaterialSection {
  id: number;
  sectionId: number;
  name: string;
  isExpand: boolean;
  materialTypeId: number;
  fileId?: number;
  file?: IDataFile;
}

export interface IMaterialSectionResponse extends GenericResponse {
  response: {
    data: IDataMaterialSection[];
    meta: Meta;
  };
}
