import { api } from "../../feature/interceptor/interceptor";
import {
  AuthenticationResponse,
  IParamUser,
  IResponseUser,
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
function getAllUsers(params: IParamUser): Promise<IResponseUser> {
  return api.get("user", { params });
}
export const authService = {
  authGet,
  authLogin,
  authLogout,
  updateToken,
  getAllUsers,
};
