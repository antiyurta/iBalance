import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { coreReducer } from "../core/reducer/CoreReducer";
import UserReducer from "./slice/user.slice";
import TabsReducer from "./slice/tab.slice";
import PaneReducer from "./slice/param.slice";
import WarehouseReducer from "./slice/warehouse.slice";
import PosOpenCloseReducer from "./slice/pos-open-close.slice";
import ShoppingCartReducer from "./slice/point-of-sale/shopping-cart.slice";
import ShoppingGoodsReducer from "./slice/point-of-sale/goods.slice";
import ShoppingTempReducer from "./slice/point-of-sale/temp.slice";

const rootReducer = combineReducers({
  core: coreReducer,
  user: UserReducer,
  tabs: TabsReducer,
  pane: PaneReducer,
  warehouse: WarehouseReducer,
  posOpenClose: PosOpenCloseReducer,
  shoppingCart: ShoppingCartReducer,
  shoppingGoods: ShoppingGoodsReducer,
  shoppingTemp: ShoppingTempReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default rootReducer;
