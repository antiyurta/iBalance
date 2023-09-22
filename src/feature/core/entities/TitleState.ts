import { ReactNode } from "react";

export interface TitleState {
  label: string | ReactNode;
}

export enum TitleActionType {
  SET_TITLE_DATA = "SET_TITLE_DATA",
}
