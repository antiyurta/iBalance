import { IGoods } from "@/service/pos/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
const initialState: IGoods[] = [];
const shoppingGoods = createSlice({
  name: "shoppingGoods",
  initialState,
  reducers: {
    emptyGoods: () => {
      return initialState;
    },
    saveGoods: (state, action: PayloadAction<IGoods>) => {
      const existingIndex = state.findIndex(
        (item) => item.materialId === action.payload.materialId
      );
      const goods = action.payload;
      if (existingIndex == -1) {
        state.push(goods);
      } else {
        state[existingIndex].materialName = goods.materialName;
        state[existingIndex].sectionName = goods.sectionName;
        state[existingIndex].unitAmount = goods.unitAmount;
        state[existingIndex].discountAmount = goods.discountAmount;
        state[existingIndex].quantity = goods.quantity;
        state[existingIndex].payAmount = goods.payAmount;
        state[existingIndex].totalAmount = goods.totalAmount;
      }
      return state;
    },
    removeGoods: (state, action: PayloadAction<number>) => {
      const currentIndex = state.findIndex(
        (item) => item.materialId == action.payload
      );
      state.splice(currentIndex, 1);
      return state;
    },
  },
});
export const { emptyGoods, saveGoods, removeGoods } = shoppingGoods.actions;
export default shoppingGoods.reducer;
