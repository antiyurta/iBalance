import { AnyAction } from "redux";
import { IMethod, PosStepActionType } from "../entities/PosStepReducer";
import { IDataConsumer } from "@/service/consumer/entities";
import { IDataConsumerMembership } from "@/service/consumer/membership/entities";

function setIsMembership(isMembership: boolean): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({ type: PosStepActionType.SET_IS_MEMBERSHIP, data: isMembership });
  };
}

function setRegnoOrPhono(regnoOrPhono: string): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_REGNO_OR_PHONO,
      data: regnoOrPhono,
    });
  };
}

function setConsumer(consumer: IDataConsumer): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_CONSUMER,
      data: consumer,
    });
  };
}

function setMembershipId(id: number): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_MEMBERSHIP_ID,
      data: id,
    });
  };
}

function setMembership(data: IDataConsumerMembership): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_MEMBERSHIP,
      data: data,
    });
  };
}

function setIsSaveAndSaveValue(state: boolean, value: number): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_IS_SAVE_AND_SET_SAVE_VALUE,
      data: {
        isSave: state,
        saveValue: value,
      },
    });
  };
}

function setIsUseSaveAndSeUseValue(state: boolean, value: number): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_IS_USE_SAVE_AND_SET_USE_VALUE,
      data: {
        isUseSave: state,
        useValue: value,
      },
    });
  };
}

function setMethods(data: IMethod): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.SET_METHODS,
      data: data,
    });
  };
}

function removeMethod(id: number): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: PosStepActionType.REMOVE_METHOD,
      data: id,
    });
  };
}

export const PosStepActions = {
  setIsMembership,
  setRegnoOrPhono,
  setConsumer,
  setMembershipId,
  setMembership,
  setIsSaveAndSaveValue,
  setIsUseSaveAndSeUseValue,
  setMethods,
  removeMethod,
};
