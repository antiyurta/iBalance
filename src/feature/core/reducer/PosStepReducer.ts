import { AnyAction } from "redux";
import { PosStepActionType, PosStepState } from "../entities/PosStepReducer";

const initialValues: PosStepState = {
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

export function posStepReducer(
  state: PosStepState = initialValues,
  action: AnyAction
) {
  const { type, data } = action;

  switch (type) {
    case PosStepActionType.SET_IS_MEMBERSHIP:
      if (data) {
        return {
          ...state,
          isMembership: data,
        };
      } else {
        return {
          ...state,
          isMembership: data,
          regnoOrPhono: "",
          consumer: undefined,
          membershipId: undefined,
          membership: undefined,
          isSave: false,
        };
      }
    case PosStepActionType.SET_REGNO_OR_PHONO:
      return {
        ...state,
        regnoOrPhono: data,
        consumer: undefined,
        membershipId: undefined,
        membership: undefined,
        isSave: false,
        saveValue: 0,
      };
    case PosStepActionType.SET_CONSUMER:
      return {
        ...state,
        consumer: data,
      };
    case PosStepActionType.SET_MEMBERSHIP_ID:
      return {
        ...state,
        membershipId: data,
      };
    case PosStepActionType.SET_MEMBERSHIP:
      return {
        ...state,
        membership: data,
      };
    case PosStepActionType.SET_IS_SAVE_AND_SET_SAVE_VALUE:
      return {
        ...state,
        isSave: data.isSave,
        saveValue: data.saveValue,
      };
    case PosStepActionType.SET_IS_USE_SAVE_AND_SET_USE_VALUE:
      return {
        ...state,
        isUseSave: data.isUseSave,
        useValue: data.useValue,
      };
    case PosStepActionType.SET_METHODS:
      console.log(data, state.methods);
      if (state.methods) {
        const index = state.methods?.findIndex(
          (method) => method.id === data.id
        );
        if (index > -1) {
        } else {
          return {
            ...state,
            methods: [...state.methods, data],
          };
        }
      } else {
        return {
          ...state,
          methods: [data],
        };
      }
    case PosStepActionType.REMOVE_METHOD:
      return {
        ...state,
        methods: state.methods?.filter((method) => method.id !== data),
      };
    default:
      return state;
  }
}
