import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IDataWarehouse | { id: number; name: string } = {
  id: 0,
  name: "Хоосон",
};

export const warehouse = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    emptyWarehouse: () => {
      return initialState;
    },
    setWarehouse: (state, action: PayloadAction<IDataWarehouse>) => {
      state = action.payload;
      return action.payload;
    },
  },
});
export const { emptyWarehouse, setWarehouse } = warehouse.actions;
export default warehouse.reducer;
