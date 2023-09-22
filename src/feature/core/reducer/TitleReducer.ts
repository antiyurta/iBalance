import { AnyAction } from "redux";
import { TitleActionType, TitleState } from "../entities/TitleState";

const initialValues: TitleState = {
  label: "",
};

export function titleReducer(
  state: TitleState = initialValues,
  action: AnyAction
) {
  const { type, data } = action;
  switch (type) {
    case TitleActionType.SET_TITLE_DATA:
      return {
        ...state,
        label: data.label as string,
      };
    default:
      return state;
  }
}
