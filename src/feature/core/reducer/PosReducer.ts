import { RootState } from "@/feature/store/reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDataConsumer } from "@/service/consumer/entities";
import { IDataConsumerMembership } from "@/service/consumer/membership/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";

export interface IMethod {
  id: number;
  imageUrl: string;
  type: PaymentType;
  name: string;
  amount: number;
}

export interface PosStepState {
  isMembership: boolean;
  regnoOrPhono: string;
  consumer: IDataConsumer | undefined;
  membershipId: number | undefined;
  membership: IDataConsumerMembership | undefined;
  isSave: boolean;
  saveValue: number;
  isUseSave: boolean;
  useValue: number;
  methods: IMethod[] | undefined;
}

const initialState: PosStepState = {
  isMembership: false,
  regnoOrPhono: "",
  consumer: undefined,
  membershipId: undefined,
  membership: undefined,
  isSave: false,
  saveValue: 0,
  isUseSave: false,
  useValue: 0,
  methods: undefined,
};

const posReducer = createSlice({
  name: "posReducer",
  initialState,
  reducers: {
    setIsMembership: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.isMembership = action.payload;
      } else {
        state.isMembership = action.payload;
        state.regnoOrPhono = "";
        state.consumer = undefined;
        state.membershipId = undefined;
        state.membership = undefined;
        state.isSave = false;
      }
    },
    setRegnoOrPhone: (state, action: PayloadAction<string>) => {
      state.regnoOrPhono = action.payload;
      state.consumer = undefined;
      state.membershipId = undefined;
      state.membership = undefined;
      state.isSave = false;
      state.saveValue = 0;
    },
    setConsumer: (state, action: PayloadAction<IDataConsumer>) => {
      state.consumer = action.payload;
    },
    setMembershipId: (state, action: PayloadAction<number>) => {
      state.membershipId = action.payload;
    },
    setMembership: (state, action: PayloadAction<IDataConsumerMembership>) => {
      state.membership = action.payload;
    },
    setIsSaveAndSetSaveValue: (
      state,
      action: PayloadAction<{ isSave: boolean; saveValue: number }>
    ) => {
      state.isSave = action.payload.isSave;
      state.saveValue = action.payload.saveValue;
    },
    setIsUseSaveAndSetUseValue: (
      state,
      action: PayloadAction<{ isUseSave: boolean; useValue: number }>
    ) => {
      state.isUseSave = action.payload.isUseSave;
      state.useValue = action.payload.useValue;
    },
    setMethods: (state, action: PayloadAction<IMethod>) => {
      if (state.methods) {
        const index = state.methods?.findIndex(
          (method) => method.id === action.payload.id
        );
        if (index > -1) {
        } else {
          state.methods = [...state.methods, action.payload];
        }
      } else {
        state.methods = [action.payload];
      }
    },
    removeMethod: (state, action: PayloadAction<number>) => {
      state.methods = state.methods?.filter(
        (method) => method.id !== action.payload
      );
    },
  },
});

export const {
  setIsMembership,
  setRegnoOrPhone,
  setConsumer,
  setMembershipId,
  setMembership,
  setIsSaveAndSetSaveValue,
  setIsUseSaveAndSetUseValue,
  setMethods,
  removeMethod,
} = posReducer.actions;

export const selectPosStep = (state: RootState) => state.posStep;

export default posReducer.reducer;
