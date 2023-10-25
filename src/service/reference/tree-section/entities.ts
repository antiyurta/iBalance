import { GenericResponse } from "@/service/entities";

export interface Params {
  name?: string;
  sectionId?: number;
  type?: TreeSectionType;
}

export enum TreeSectionType {
  Consumer = "CONSUMER",
  Warehouse = "WAREHOUSE",
}

export interface IDataTreeSection {
  id: number;
  sectionId: number;
  name: string;
  isExpand: boolean;
  type: TreeSectionType;
  sections: IDataTreeSection[];
}

export interface ITreeSectionOneResponse extends GenericResponse {
  response: IDataTreeSection;
}

export interface ITreeSectionResponse extends GenericResponse {
  response: IDataTreeSection[];
}
