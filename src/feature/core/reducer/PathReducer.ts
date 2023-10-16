import { AnyAction } from "redux";
import { PathActionType, PathState } from "../entities/PathState";

const initialValues: PathState = {
  label: "Хянах самбар",
  path: ["/main/dashboard"],
};

export function pathReducer(
  state: PathState = initialValues,
  action: AnyAction
) {
  const { type, data } = action;
  switch (type) {
    case PathActionType.SET_PATH_DATA:
      return {
        ...state,
        label: data.label as string,
        path: data.path as string[],
      };
    default:
      return state;
  }
}
