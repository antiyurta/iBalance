import { GenericResponse, Quearies } from "@/service/entities";

export interface Params {
  name?: string;
  sectionId?: number;
  type?: TreeSectionType;
}

export enum TreeSectionType {
  Consumer = "CONSUMER",
  Branch = "BRANCH",
  Storage = "STORAGE",
  Department = "DEPARTMENT",
}

export interface IDataConsumerSection {
  id: number;
  sectionId: number;
  name: string;
  isExpand: boolean;
  type: TreeSectionType;
  sections: IDataConsumerSection[];
}

export interface IConsumerSectionOneResponse extends GenericResponse {
  response: IDataConsumerSection;
}

export interface IConsumerSectionResponse extends GenericResponse {
  response: IDataConsumerSection[];
}
