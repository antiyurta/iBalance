"use client";
import { notification } from "antd";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { CoreActions } from "../core/actions/CoreAction";
import { authService } from "../../service/authentication/service";
import { RootState } from "../store/reducer";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
  },
});

let isRetry: boolean = false;

export const Interceptor = (api: AxiosInstance, store: any) => {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getState().core.login_data?.response?.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    (error: AxiosError<any>) => {
      const { response } = error;
      const { core } = store.getState() as RootState;
      const { login_data } = core;
      if (error?.response?.status == 401 && error?.config && !isRetry) {
        isRetry = true;
        return new Promise((resolve, reject) => {
          authService
            .updateToken({
              accessToken: login_data.response.accessToken,
              refreshToken: login_data.response.refreshToken,
            })
            .then((res) => {
              if (error.config) {
                error.config.headers[
                  "Authorization"
                ] = `Bearer ${res.response.accessToken}`;
                store.dispatch(CoreActions.setLoginData(res));
                api.request(error.config).then(resolve).catch(reject);
              }
            })
            .catch(() => {
              store.dispatch(CoreActions.setLoggedIn(false));
              reject;
            })
            .finally(() => (isRetry = false));
        });
      }
      console.log(response);
      const message =
        (response?.data?.message instanceof Array
          ? response?.data?.message[0]
          : response?.data?.message) || error.message;
      notification.error({
        message: "Амжилтгүй",
        description: message,
      });
      return Promise.reject(response?.data);
    }
  );
};
