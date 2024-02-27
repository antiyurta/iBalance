import { IGoods, ITemp } from "@/service/pos/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
const initialState: ITemp[] = [];
const shoppingTemp = createSlice({
  name: "shoppingTemp",
  initialState,
  reducers: {
    emptyTemp: () => {
      return initialState;
    },
    createTemp: (state, action: PayloadAction<IGoods[]>) => {
      const goods = action.payload;
      const newTemp: ITemp = {
        quantity: goods.reduce((total, item) => total + item.quantity, 0),
        counter: goods.length,
        amount: goods.reduce((total, item) => total + item.payAmount, 0),
        date: new Date(),
        goods,
      };
      state.push(newTemp);
      return state;
    },
    removeTemp: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
      return state;
    },
  },
});
export const { emptyTemp, createTemp, removeTemp } = shoppingTemp.actions;
export default shoppingTemp.reducer;
