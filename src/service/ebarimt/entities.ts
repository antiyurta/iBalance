import { GenericResponse } from "../entities";

export interface IDataMerchantInfo {
  citypayer: boolean;
  found: boolean;
  freeProject: boolean;
  lastReceiptDate: string | null;
  message: string;
  name: string;
  receiptFound: boolean;
  register: string;
  success: boolean;
  vatpayer: true;
  vatpayerRegisteredDate: string;
}

export interface EBarimtResponse extends GenericResponse {
  response: {
    message: string;
    result: IDataMerchantInfo;
    status: boolean;
  };
}
