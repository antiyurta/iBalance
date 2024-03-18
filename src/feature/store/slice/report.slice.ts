import { IParamReportMaterial } from "@/service/report/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IItem {
  key: string;
  param?: IParamReportMaterial;
}
interface IReportPanel {
  activeKey: string;
  items: IItem[];
}
const initialState: IReportPanel = {
  activeKey: "item-0",
  items: [{ key: "item-0" }],
};
const reportPanel = createSlice({
  name: "reportPanel",
  initialState,
  reducers: {
    emptyPanel: () => {
      return initialState;
    },
    savePanel: (state, action: PayloadAction<IItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.key === action.payload.key
      );
      state.activeKey = action.payload.key;
      if (existingIndex == -1) {
        state.items.push(action.payload);
      } else {
        state.items[existingIndex].param = action.payload.param;
      }
      return state;
    },
    removePanel: (state, action: PayloadAction<string>) => {
      let newActiveKey = state.activeKey;
      let lastIndex = -1;
      state.items.forEach((item, i) => {
        if (item.key === action.payload) {
          lastIndex = i - 1;
        }
      });
      const newPanels = state.items.filter(
        (item) => item.key !== action.payload
      );
      if (newPanels.length && newActiveKey === action.payload) {
        if (lastIndex >= 0) {
          newActiveKey = newPanels[lastIndex].key;
        } else {
          newActiveKey = newPanels[0].key;
        }
      }
      state.activeKey = newActiveKey;
      state.items = newPanels;
    },
  },
});
export const { emptyPanel, savePanel, removePanel } = reportPanel.actions;
export default reportPanel.reducer;
