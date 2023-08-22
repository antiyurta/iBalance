import { LoginResponse } from "@/service/authentication/entities";

export interface CoreState {
    isLoggedIn: boolean;
    login_data: LoginResponse;
    remember_me: string;
}

export enum CoreActionType {
    SET_ISLOGGED_IN = "SET_ISLOGGED_IN",
    SET_LOGIN_DATA = "SET_LOGIN_DATA",
    SET_REMEMBER_ME = "SET_REMEMBER_ME"
}