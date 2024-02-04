import { IParam } from "@/service/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface IItem {
  key: string;
  param: IParam;
}
interface IPane {
  activeKey: string;
  items: IItem[];
}
const initialState: IPane = {
  activeKey: "",
  items: [],
};
const pane = createSlice({
  name: "pane",
  initialState,
  reducers: {
    emptyPane: () => {
      return initialState;
    },
    newPane: (state, action: PayloadAction<IItem>) => {
      const existingTab = state.items.find(
        (item) => item.key === action.payload.key
      );
      state.activeKey = action.payload.key;
      if (!existingTab) {
        action.payload.param = {
          page: 1,
          limit: 10,
          filters: [],
          order: "DESC",
          orderParam: ["createdAt"],
        };
        state.items.push(action.payload);
      }
      return state;
    },
    removePane: (state, action: PayloadAction<string>) => {
      let newActiveKey = state.activeKey;
      let lastIndex = -1;
      state.items.forEach((item, i) => {
        if (item.key === action.payload) {
          lastIndex = i - 1;
        }
      });
      const newPanes = state.items.filter(
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
      state.items = newPanes;
    },
    changeParam: (state, action: PayloadAction<IParam>) => {
      const currentIndex = state.items.findIndex(
        (item) => item.key === state.activeKey
      );
      if (currentIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[currentIndex] = {
          ...updatedItems[currentIndex],
          param: action.payload,
        };
        return {
          ...state,
          items: updatedItems,
        };
      }
      return state;
    },
  },
});
export const { emptyPane, newPane, removePane, changeParam } =
  pane.actions;
export default pane.reducer;
