import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { coreReducer } from "../core/reducer/CoreReducer";
import { titleReducer } from "../core/reducer/TitleReducer";
import { tabReducer } from "../core/reducer/TabsReducer";
import WarehouseReducer from "./slice/warehouse.slice";
import ShoppingCartReducer from "./slice/shopping-cart.slice";
import PosOpenClose from "./slice/pos-open-close.slice";

const rootReducer = combineReducers({
  core: coreReducer,
  title: titleReducer,
  tabs: tabReducer,
  warehouse: WarehouseReducer,
  shoppingCart: ShoppingCartReducer,
  posOpenClose: PosOpenClose,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default rootReducer;
