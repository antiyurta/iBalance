import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { coreReducer } from "../core/reducer/CoreReducer";
import { pathReducer } from "../core/reducer/PathReducer";
import { titleReducer } from "../core/reducer/TitleReducer";
import { reportReducer } from "../core/reducer/ReportReducer";

const rootReducer = combineReducers({
  core: coreReducer,
  currentPath: pathReducer,
  title: titleReducer,
  report: reportReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default rootReducer;
