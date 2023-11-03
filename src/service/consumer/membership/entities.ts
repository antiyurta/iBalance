import { Dayjs } from "dayjs";
import { ColumnType, DataIndexType, GenericResponse, IFilter, IParam, Meta } from "../../entities";
import { IDataConsumer } from "../entities";
import { IDataMembership } from "@/service/reference/membership/entities";

export interface IDataConsumerMembership {
  id: number;
  cardno: string;
  membershipId: number;
  consumerId: number;
  branchId: number;
  amount: number;
  endAt: Dayjs;
  isClose: boolean;
  consumer: IDataConsumer;
  membership: IDataMembership;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}
export interface IInputConsumerMembership {
  consumerId: number;
  cards: IDataConsumerMembership[];
}
export interface IFilterConsumerMembership extends IFilter {
  consumerCode?: string[];
  consumerLastname?: string[];
  consumerName?: string[];
  consumerIsIndividual?: boolean[];
  consumerPhone?: string[];
  consumerIsActive?: boolean[];
  consumerIsEmployee?: boolean[];
  consumerSectionId?: number[];
  consumerEmail?: string[];
  consumerAddress?: string[];
  consumerRegno?: string[];
  consumerBank?: string[];
  consumerBankAccountNo?: string[];
  cardno?: string[];
  membershipName?: string[];
  createdAt?: string;
  branch?: number[];
  isClose?: boolean[];
  endAt?: string;
}
export type FilteredColumnsConsumerMembership = {
  [T in keyof IFilterConsumerMembership]?: ColumnType;
};
export const defaultColumnConsumerMembership = {
  code: {
    label: "Харилцагчийн код",
    isView: true,
    isFiltered: false,
    dataIndex: "code",
    type: DataIndexType.MULTI,
  },
  isIndividual: {
    label: "Хувь хүн эсэх",
    isView: true,
    isFiltered: false,
    dataIndex: "isIndividual",
    type: DataIndexType.BOOLEAN,
  },
  isEmployee: {
    label: "Ажилтан эсэх",
    isView: true,
    isFiltered: false,
    dataIndex: "isEmployee",
    type: DataIndexType.BOOLEAN,
  },
  lastName: {
    label: "Харилцагчийн овог",
    isView: true,
    isFiltered: false,
    dataIndex: "lastName",
    type: DataIndexType.MULTI,
  },
  name: {
    label: "Харилцагчийн нэр",
    isView: true,
    isFiltered: false,
    dataIndex: "name",
    type: DataIndexType.MULTI,
  },
  sectionId: {
    label: "Харилцагчийн бүлэг",
    isView: true,
    isFiltered: false,
    dataIndex: ["section", "name"],
    type: DataIndexType.STRING_SECTION,
  },
  regno: {
    label: "Регистр №",
    isView: true,
    isFiltered: false,
    dataIndex: "regno",
    type: DataIndexType.MULTI,
  },
  phone: {
    label: "Утасны дугаар",
    isView: true,
    isFiltered: false,
    dataIndex: "phone",
    type: DataIndexType.MULTI,
  },
  address: {
    label: "Хаяг",
    isView: true,
    isFiltered: false,
    dataIndex: "address",
    type: DataIndexType.MULTI,
  },
  bankId: {
    label: "Банкны нэр",
    isView: true,
    isFiltered: false,
    dataIndex: ["bank", "name"],
    type: DataIndexType.MULTI,
  },
  bankAccountNo: {
    label: "Дансны дугаар",
    isView: true,
    isFiltered: false,
    dataIndex: "bankAccountNo",
    type: DataIndexType.MULTI,
  },
  email: {
    label: "И-мэйл хаяг",
    isView: false,
    isFiltered: false,
    dataIndex: "email",
    type: DataIndexType.MULTI,
  },
  isActive: {
    label: "Төлөв",
    isView: true,
    isFiltered: false,
    dataIndex: "isActive",
    type: DataIndexType.BOOLEAN,
  },
  createdAt: {
    label: "Карт нээсэн огноо",
    isView: true,
    isFiltered: false,
    dataIndex: "createdAt",
    type: DataIndexType.DATE,
  },
  updatedAt: {
    label: "Өөрчлөлт хийсэн огноо",
    isView: false,
    isFiltered: false,
    dataIndex: "updatedAt",
    type: DataIndexType.DATE,
  },
  updatedBy: {
    label: "Өөрчлөлт хийсэн хэрэглэгч",
    isView: true,
    isFiltered: false,
    dataIndex: ["updatedUser", "firstName"],
    type: DataIndexType.USER,
  },
};
export interface IParamConsumerMembership
  extends Meta,
    IParam,
    IFilterConsumerMembership {}
export interface IResponseConsumerMembership extends GenericResponse {
  response: {
    data: IDataConsumerMembership[];
    meta: Meta;
    filter: IFilterConsumerMembership;
  };
}
