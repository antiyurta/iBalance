import { api } from "@/feature/interceptor/interceptor";
import { IDataEmployee, IResponseEmployee } from "./entities";

function post(body: IDataEmployee): Promise<IResponseEmployee> {
  return api.post("/organization/employee", body);
}
function patch(id: number, body: IDataEmployee): Promise<IResponseEmployee> {
  return api.patch(`/organization/employee/${id}`, body);
}
export const EmployeeService = { post, patch };