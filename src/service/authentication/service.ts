import { api } from "../../feature/interceptor/interceptor";
import {
  AuthenticationResponse,
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
  return api.get(`/authentication`);
}
function updateToken(tokens: Tokens): Promise<LoginResponse> {
  return api.get("/authentication/refresh/token", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      "refresh-token": tokens.refreshToken,
    },
  });
}
export const authService = {
  authGet,
  authLogin,
  authLogout,
  updateToken,
};
