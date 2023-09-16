import { api } from "../../feature/interceptor/interceptor";
import { ICountryResponse } from "../material/brand/entities";
import {
  IDataReference,
  IReferenceResponse,
  IType,
  IUserResponse,
} from "./entity";

function get(type: IType): Promise<IReferenceResponse> {
  return api.get("reference-section", {
    params: {
      type: type,
    },
  });
}

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

function post(body: IDataReference): Promise<IReferenceResponse> {
  return api.post("reference-section", body);
}

function remove(id: number): Promise<IReferenceResponse> {
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
  remove,
  removeUploadImage,
};
