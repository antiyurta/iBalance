import { AnyAction } from "redux";
import { ReportActionType, ReportState } from "../entities/ReportState";

const initialValues: ReportState = {};

export function reportReducer(
  state: ReportState = initialValues,
  action: AnyAction
) {
  const { type, data } = action;
  switch (type) {
    case ReportActionType.SET_FILTER_VALUES:
      return {
        ...state,
        ...data,
      };
    default:
      return state;
  }
}
