import { GenericResponse, Meta } from "@/service/entities";

export interface Params {
  sectionId?: number;
}

export interface IDataMaterialSection {
  id: number;
  sectionId: number;
  name: string;
  isExpand: boolean;
  materialTypeId: number;
}

export interface IMaterialSectionResponse extends GenericResponse {
  response: {
    data: IDataMaterialSection[];
    meta: Meta;
  };
}
