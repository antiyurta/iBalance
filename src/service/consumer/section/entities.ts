import { GenericResponse } from "@/service/entities";

export interface Params {
  sectionId?: number;
}

export interface IDataConsumerSection {
  id: number;
  sectionId: number;
  name: string;
  isExpand: boolean;
  sections: IDataConsumerSection[];
}

export interface IConsumerSectionResponse extends GenericResponse {
  response: IDataConsumerSection[];
}
