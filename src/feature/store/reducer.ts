import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { coreReducer } from "../core/reducer/CoreReducer";
import { titleReducer } from "../core/reducer/TitleReducer";
import { reportReducer } from "../core/reducer/ReportReducer";
import { tabReducer } from "../core/reducer/TabsReducer";
import { posStepReducer } from "../core/reducer/PosStepReducer";

const rootReducer = combineReducers({
  core: coreReducer,
  title: titleReducer,
  report: reportReducer,
  tabs: tabReducer,
  posStep: posStepReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default rootReducer;
