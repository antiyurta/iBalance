import { ReactNode } from "react";

export interface PathState {
    label: string | ReactNode;
    path: string[]
}

export enum PathActionType {
    SET_PATH_DATA = "SET_PATH_DATA"
}