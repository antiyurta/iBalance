import { api } from "@/feature/interceptor/interceptor";
import {
  IDataEmployee,
  IParamEmployee,
  IResponseEmployee,
  IResponseEmployees,
} from "./entities";

function get(params: IParamEmployee): Promise<IResponseEmployees> {
  return api.get("/organization/employee", { params });
}
function post(body: IDataEmployee): Promise<IResponseEmployee> {
  return api.post("/organization/employee", body);
}
function patch(id: number, body: IDataEmployee): Promise<IResponseEmployee> {
  return api.patch(`/organization/employee/${id}`, body);
}
export const EmployeeService = { get, post, patch };
