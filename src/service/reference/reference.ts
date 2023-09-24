import { api } from "../../feature/interceptor/interceptor";
import { ICountryResponse } from "./brand/entities";
import {
  IDataReference,
  IParamReference,
  IResponseReference,
  IType,
  IUserResponse,
} from "./entity";

function getUsers(params: { ids: number[] }): Promise<IUserResponse> {
  return api.get("user", {
    params: params,
  });
}

function getCountries(): Promise<ICountryResponse> {
  return api.get("reference/country", {
    params: {
      type: 1,
    },
  });
}
function get(params: IParamReference): Promise<IResponseReference> {
  return api.get("reference-section", { params });
}
function post(body: IDataReference): Promise<IResponseReference> {
  return api.post("reference-section", body);
}
function patch(id: number, body: IDataReference): Promise<IResponseReference> {
  return api.patch(`reference-section/${id}`, body);
}

function remove(id: number): Promise<IResponseReference> {
  return api.delete("reference-section/" + id);
}

function removeUploadImage(id: number): Promise<any> {
  return api.delete("local-files/" + id);
}

export const ReferenceService = {
  get,
  getCountries,
  getUsers,
  post,
  patch,
  remove,
  removeUploadImage,
};
