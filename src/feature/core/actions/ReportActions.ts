import { AnyAction } from "redux";
import { ReportActionType, ReportState } from "../entities/ReportState";

function setFilterValues(data: ReportState): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: ReportActionType.SET_FILTER_VALUES,
      data: data,
    });
  };
}

export const ReportActions = {
  setFilterValues,
};
