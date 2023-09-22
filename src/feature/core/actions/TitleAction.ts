import { AnyAction } from "redux";
import { TitleActionType, TitleState } from "../entities/TitleState";

function setTitleData(data: TitleState): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: TitleActionType.SET_TITLE_DATA,
      data: data,
    });
  };
}

export const TitleActions = {
  setTitleData,
};
