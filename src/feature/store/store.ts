import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducer";

let storageConfig = null;

if (typeof window !== "undefined" && window.localStorage) {
  storageConfig = {
    getItem: (key: string) => {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem: (key: string, value: string) => {
      return Promise.resolve(window.localStorage.setItem(key, value));
    },
    removeItem: (key: string) => {
      return Promise.resolve(window.localStorage.removeItem(key));
    },
  };
} else {
  storageConfig = {
    getItem: (key: string) => {
      return Promise.resolve(null);
    },
    setItem: (key: string, value: string) => {
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      return Promise.resolve();
    },
  };
}

const persistConfig = {
  key: "root",
  storage: storageConfig as any, // Type assertion to `any` to bypass the type check
  whitelist: [
    "core",
    "user",
    "tabs",
    "pane",
    "warehouse",
    "posOpenClose",
    "shoppingCart",
    "shoppingGoods",
    "shoppingTemp",
    "reportPanel",
  ],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { persistor, store };
export type AppDispatch = typeof store.dispatch;
