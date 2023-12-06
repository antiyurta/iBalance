import { IDataPosOpenClose } from "../entities";
import { IDataReference } from "@/service/reference/entity";

export interface IDataPosBankNote {
  id?: number;
  openCloseId?: number;
  openClose?: IDataPosOpenClose;
  sectionMoneyId: number;
  money?: IDataReference;
  quantity: number;
  amount: number;
}

