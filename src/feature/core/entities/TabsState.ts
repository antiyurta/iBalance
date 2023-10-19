import type { TabPaneProps } from "antd";
import { ReactNode } from "react";

export interface ITabItems extends Omit<TabPaneProps, "tabs"> {
  key: string;
  label: ReactNode;
}

export interface TabState {
  activeKey: string;
  tabItems: ITabItems[];
}

export enum TabActionType {
  SET_DATA = "SET_DATA",
  SET_ACTIVE_KEY = "SET_ACTIVE_KEY",
  REMOVE_DATA = "REMOVE_DATA",
}
