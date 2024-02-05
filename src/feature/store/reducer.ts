import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { coreReducer } from "../core/reducer/CoreReducer";
import { titleReducer } from "../core/reducer/TitleReducer";
import UserReducer from "./slice/user.slice";
import TabsReducer from "./slice/tab.slice";
import PaneReducer from "./slice/param.slice";
import WarehouseReducer from "./slice/warehouse.slice";
import ShoppingCartReducer from "./slice/shopping-cart.slice";
import PosOpenClose from "./slice/pos-open-close.slice";

const rootReducer = combineReducers({
  core: coreReducer,
  user: UserReducer,
  title: titleReducer,
  tabs: TabsReducer,
  pane: PaneReducer,
  warehouse: WarehouseReducer,
  shoppingCart: ShoppingCartReducer,
  posOpenClose: PosOpenClose,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default rootReducer;
