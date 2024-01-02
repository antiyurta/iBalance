import { api } from "../../feature/interceptor/interceptor";
import { IResponseCountry } from "./country/entities";
import {
  IDataReference,
  IParamReference,
  IResponseReference,
} from "./entity";

function getCountries(): Promise<IResponseCountry> {
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

function getImage(id: number): Promise<any> {
  return api.get("local-files/" + id, {
    responseType: "blob",
  });
}
function getGlobalImage(id: number): Promise<any> {
  return api.get(`global-files/${id}`, {
    responseType: "blob",
  });
}

function removeUploadImage(id: number): Promise<any> {
  return api.delete("local-files/" + id);
}
function removeGlobalImage(id: number): Promise<any> {
  return api.delete("global-files/" + id);
}

export const ReferenceService = {
  get,
  getCountries,
  getImage,
  getGlobalImage,
  post,
  patch,
  remove,
  removeUploadImage,
  removeGlobalImage,
};
