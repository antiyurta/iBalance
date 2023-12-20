import { IDataPos } from "@/service/pos/entities";
import { IDataPosOpenClose } from "@/service/pos/open-close/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IDataPosOpenClose | { id: number; posId: number } = {
  id: 0,
  posId: 0,
};

export const posOpenClose = createSlice({
  name: "pos-open-close",
  initialState,
  reducers: {
    emptyPosOpenClose: () => {
      return initialState;
    },
    setPosOpenClose: (state, action: PayloadAction<IDataPosOpenClose>) => {
      state = action.payload;
      return action.payload;
    },
  },
});
export const { emptyPosOpenClose, setPosOpenClose } = posOpenClose.actions;
export default posOpenClose.reducer;
