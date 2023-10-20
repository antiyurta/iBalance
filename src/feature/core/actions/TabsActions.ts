import { AnyAction } from "redux";
import { TabActionType, ITabItems } from "../entities/TabsState";

function setTabsData(data: ITabItems): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: TabActionType.SET_DATA,
      data: data,
    });
  };
}

function setTabActiveKey(data: string): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: TabActionType.SET_ACTIVE_KEY,
      data: data,
    });
  };
}

function removeTab(data: ITabItems[]): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: TabActionType.REMOVE_DATA,
      data: data,
    });
  };
}
function setDefaultTab(): any {
  return (dispatch: (action: AnyAction) => void) => {
    dispatch({
      type: TabActionType.SET_DEFAULT,
    });
  };
}

export const TabsActions = {
  setDefaultTab,
  setTabsData,
  setTabActiveKey,
  removeTab,
};
