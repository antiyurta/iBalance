import { GenericResponse } from "@/service/entities";

export interface Params {
  sectionId?: number;
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

export interface IConsumerSectionResponse extends GenericResponse {
  response: IDataConsumerSection[];
}
