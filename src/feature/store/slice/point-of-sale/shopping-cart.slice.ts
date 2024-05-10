import { PaymentType } from "@/service/reference/payment-method/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
type TaxType = "Company" | "Citizen";
interface IShoppingCart {
  isModal: boolean;
  currentStep?: number;
  membershipId?: number;
  useMembershipPoint?: number;
  useGiftPoint?: number;
  invoices: IInvoice[];
  tax?: TaxType;
  regno?: string;
}

interface IStepDiscount {
  membershipId: number;
  useMembershipPoint: number;
  useGiftPoint: number;
}
export interface IInvoice {
  payMethodId: number;
  methodName: string;
  logo: string;
  type: PaymentType;
  incomeAmount: number;
  expenseAmount: number;
}
interface IStepReport {
  tax: TaxType;
  regno: string;
}

const initialState: IShoppingCart = { isModal: false, invoices: [] };

const shoppingCart = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    emptyShoppingCart: () => {
      return initialState;
    },
    onShoppingCart: (state) => {
      state.isModal = true;
      state.currentStep = 0;
      return state;
    },
    stepDiscount: (state, action: PayloadAction<IStepDiscount>) => {
      state.currentStep = 1;
      state.membershipId = action.payload.membershipId;
      state.useMembershipPoint = action.payload.useMembershipPoint;
      state.useGiftPoint = action.payload.useGiftPoint;
      return state;
    },
    onPaid: (state, action: PayloadAction<IInvoice>) => {
      const invoice = action.payload;
      const currentIndex = state.invoices.findIndex(
        (item) => item.payMethodId == invoice.payMethodId
      );
      if (currentIndex == -1) {
        state.invoices.push(invoice);
      } else {
        state.invoices[currentIndex].incomeAmount = invoice.incomeAmount;
        state.invoices[currentIndex].expenseAmount = invoice.expenseAmount;
      }
      return state;
    },
    removePaid: (state, action: PayloadAction<IInvoice>) => {
      const invoice = action.payload;
      const currentIndex = state.invoices.findIndex(
        (item) => item.payMethodId == invoice.payMethodId
      );
      if (currentIndex !== -1) {
        state.invoices.splice(currentIndex, 1);
      }
      return state;
    },
    stepPayment: (state) => {
      state.currentStep = 2;
    },
    stepReport: (state, action: PayloadAction<IStepReport>) => {
      state.tax = action.payload.tax;
      state.regno = action.payload.regno;
    },
    prevStep: (state) => {
      if (state.currentStep) {
        state.currentStep -= 1;
      }
    },
  },
});
export const {
  emptyShoppingCart,
  onShoppingCart,
  stepDiscount,
  onPaid,
  removePaid,
  stepPayment,
  stepReport,
  prevStep,
} = shoppingCart.actions;
export default shoppingCart.reducer;
