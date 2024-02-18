import { api } from "@/feature/interceptor/interceptor";
import {
  IEmployeePermission,
  IParamPermission,
  IResponseMyPermissions,
  IResponsePermissions,
} from "./entities";

function get(params: IParamPermission): Promise<IResponsePermissions> {
  return api.get("warehouse-permission", { params });
}
function myPermissions(): Promise<IResponseMyPermissions> {
  return api.get("warehouse-permission/my");
}
function post(body: IEmployeePermission): Promise<IResponsePermissions> {
  return api.post("warehouse-permission", body);
}
function patch(body: IEmployeePermission): Promise<IResponsePermissions> {
  return api.patch(`warehouse-permission${body.employeeId}`, body);
}

export const PermissionService = { get, myPermissions, post, patch };
