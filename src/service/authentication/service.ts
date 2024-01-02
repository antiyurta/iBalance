import { api } from "../../feature/interceptor/interceptor";
import {
  AuthenticationResponse,
  IChangePassword,
  IChangeProfile,
  IParamUser,
  IResponsePageUsers,
  IResponseUser,
  IResponseUsers,
  LoginBody,
  LoginResponse,
  LogoutResponse,
  Tokens,
} from "./entities";

function authLogin(body: LoginBody): Promise<LoginResponse> {
  return api.post("/authentication/login", body);
}
function authLogout(): Promise<LogoutResponse> {
  return api.post("/authentication/logout");
}
function authGet(): Promise<AuthenticationResponse> {
  return api.get("/authentication");
}
function updateToken(tokens: Tokens): Promise<LoginResponse> {
  return api.get("/authentication/refresh/token", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      "refresh-token": tokens.refreshToken,
    },
  });
}
function changePassword(body: IChangePassword): Promise<IResponseUser> {
  return api.post("/authentication/change-password", body);
}
function changeProfile(body: IChangeProfile): Promise<IResponseUser> {
  return api.post("/authentication/change-profile", body);
}
function getAllUsers(params: { ids?: number[] }): Promise<IResponseUsers> {
  return api.get("user", { params });
}
function getUsers(params: IParamUser): Promise<IResponsePageUsers> {
  return api.get("user/page", { params });
}
function getUserById(id: number): Promise<IResponseUser> {
  return api.get(`/user/show/${id}`);
}
export const authService = {
  authGet,
  authLogin,
  authLogout,
  updateToken,
  getAllUsers,
  getUsers,
  getUserById,
  changePassword,
  changeProfile,
};
