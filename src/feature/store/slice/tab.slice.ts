import { IParam } from "@/service/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";

interface ITabItem {
  label: ReactNode;
  key: string;
  closeable: boolean;
  param: IParam;
}
interface ITab {
  activeKey: string;
  tabItems: ITabItem[];
}
const initialState: ITab = {
  activeKey: "/main/dashboard",
  tabItems: [
    {
      label: "Хянах самбар",
      key: "/main/dashboard",
      closeable: false,
      param: {
        filters: [],
        page: 1,
        limit: 10,
      },
    },
  ],
};
const tabs = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    emptyTabs: () => {
      return initialState;
    },
    newTab: (state, action: PayloadAction<ITabItem>) => {
      const existingTab = state.tabItems.find(
        (item) => item.key === action.payload.key
      );
      state.activeKey = action.payload.key;
      if (!existingTab) {
        state.tabItems.push(action.payload);
      }
      return state;
    },
    changeTabs: (state, action: PayloadAction<ITab>) => {
      state.activeKey = action.payload.activeKey;
      state.tabItems = action.payload.tabItems;
      return state;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      let newActiveKey = state.activeKey;
      let lastIndex = -1;
      state.tabItems.forEach((item, i) => {
        if (item.key === action.payload) {
          lastIndex = i - 1;
        }
      });
      const newPanes = state.tabItems.filter(
        (item) => item.key !== action.payload
      );
      if (newPanes.length && newActiveKey === action.payload) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
        } else {
          newActiveKey = newPanes[0].key;
        }
      }
      state.activeKey = newActiveKey;
      state.tabItems = newPanes;
    },
    changeParam: (state, action: PayloadAction<IParam>) => {
      const currentIndex = state.tabItems.findIndex(
        (item) => item.key === state.activeKey
      );
      if (currentIndex !== -1) {
        const updatedTabItems = [...state.tabItems];
        updatedTabItems[currentIndex] = {
          ...updatedTabItems[currentIndex],
          param: action.payload,
        };
        return {
          ...state,
          tabItems: updatedTabItems,
        };
      }
      return state;
    },
  },
});
export const { emptyTabs, newTab, changeTabs, removeTab, changeParam } =
  tabs.actions;
export default tabs.reducer;
