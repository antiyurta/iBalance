import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
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

const encryptedTransForm = encryptTransform({
  secretKey: `${process.env.NEXT_PUBLIC_REDUX_SECRET_KEY}`,
  onError: function (error: any) {
    console.log("redux encrypt error: ", error);
  },
});

const persistConfig = {
  key: "root",
  storage: storageConfig as any, // Type assertion to `any` to bypass the type check
  whitelist: [
    "core",
    "user",
    "report",
    "tabs",
    "pane",
    "warehouse",
    "posOpenClose",
    "shoppingCart",
    "shoppingGoods",
    "shoppingTemp",
  ],
  blacklist: [],
  transforms: [encryptedTransForm],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunkMiddleware],
});

const persistor = persistStore(store);

export { persistor, store };
export type AppDispatch = typeof store.dispatch;
