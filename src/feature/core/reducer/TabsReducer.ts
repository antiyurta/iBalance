import { AnyAction } from "redux";
import { TabActionType, TabState } from "../entities/TabsState";

const initialValues: TabState = {
  activeKey: "/main/dashboard",
  tabItems: [
    {
      label: "Хянах самбар",
      key: "/main/dashboard",
    },
  ],
};

export function tabReducer(state: TabState = initialValues, action: AnyAction) {
  const { type, data } = action;
  switch (type) {
    case TabActionType.SET_DATA:
      var isHave: boolean = state.tabItems.some((item) =>
        item.key.includes(data.key)
      );
      if (!isHave) {
        return {
          activeKey: data.key,
          tabItems: [...state.tabItems, data],
        };
      } else if (isHave) {
        return {
          activeKey: data.key,
          tabItems: state.tabItems,
        };
      }
    case TabActionType.SET_ACTIVE_KEY:
      return {
        activeKey: data,
        tabItems: state.tabItems,
      };
    case TabActionType.REMOVE_DATA:
      return {
        activeKey: state.activeKey,
        tabItems: data,
      };
    default:
      return state;
  }
}
