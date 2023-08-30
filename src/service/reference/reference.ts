import { api } from "../../feature/interceptor/interceptor";
import { IReferenceResponse, IType } from "./entity";

function get(type: IType): Promise<IReferenceResponse> {
  return api.get("reference-section", {
    params: {
      type: type,
    },
  });
}
export const ReferenceService = {
  get,
};
