import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IDataShoppingCart | undefined = {
  id: "",
  currency: "",
  openCloseId: 0,
  taxRegno: "",
  consumerMembershipId: 0,
  isPaid: false,
  counter: 0,
  quantity: 0,
  totalAmount: 0,
  materialDiscountAmount: 0,
  membershipDiscountAmount: 0,
  membershipIncreaseAmount: 0,
  payAmount: 0,
  paidAmount: 0,
  goods: [],
  giftCarts: [],
  paymentInvoices: [],
  createdBy: 0,
  updatedBy: 0,
  createdAt: "",
  updatedAt: "",
  deletedAt: "",
  giftAmount: 0,
};

export const shoppingCart = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    emptyShoppingCart: () => {
      return initialState;
    },
    setShoppingCart: (state, action: PayloadAction<IDataShoppingCart>) => {
      state = action.payload;
      return action.payload;
    },
  },
});
export const { emptyShoppingCart, setShoppingCart } = shoppingCart.actions;
export default shoppingCart.reducer;
