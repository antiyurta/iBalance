import { IDataConsumer } from "@/service/consumer/entities";
import { IDataConsumerMembership } from "@/service/consumer/membership/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";

export interface IMethod {
  id: number;
  imageUrl: string;
  type: PaymentType;
  name: string;
  amount: number;
}

export interface PosStepState {
  isMembership: boolean;
  regnoOrPhono: string;
  consumer: IDataConsumer | undefined;
  membershipId: number | undefined;
  membership: IDataConsumerMembership | undefined;
  isSave: boolean;
  saveValue: number;
  isUseSave: boolean;
  useValue: number;
  methods: IMethod[] | undefined;
}

export enum PosStepActionType {
  SET_IS_MEMBERSHIP = "SET_IS_MEMBERSHIP",
  SET_REGNO_OR_PHONO = "SET_REGNO_OR_PHONO",
  SET_CONSUMER = "SET_CONSUMER",
  SET_MEMBERSHIP_ID = "SET_MEMBERSHIP_ID",
  SET_MEMBERSHIP = "SET_MEMBERSHIP",
  SET_IS_SAVE_AND_SET_SAVE_VALUE = "SET_IS_SAVE_AND_SET_SAVE_VALUE",
  SET_IS_USE_SAVE_AND_SET_USE_VALUE = "SET_IS_USE_SAVE_AND_SET_USE_VALUE",
  SET_METHODS = "SET_METHODS",
  REMOVE_METHOD = "REMOVE_METHOD",
}
