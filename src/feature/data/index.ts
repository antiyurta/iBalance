import { ITool } from "@/service/entities";
import { PaymentType } from "@/service/reference/payment-method/entities";

export const PaymentMethodIconData = [
  { icon: "/icons/pos/pay-cart.svg", title: "Карт" },
  { icon: "/icons/pos/pay-cash.svg", title: "Мөнгө" },
  { icon: "/icons/pos/pay-service.svg", title: "Үйлчилгээ" },
];
export const PaymentTypeData = [
  { value: PaymentType.Cash, label: "Бэлэн" },
  { value: PaymentType.NotCash, label: "Бэлэн бус" },
  { value: PaymentType.Lend, label: "Зээл" },
];
export const FilterToolData: ITool[] = [
  {
    logo: "/icons/tools/Equals.png",
    title: "Тэнцүү",
    operator: "EQUALS",
  },
  {
    logo: "/icons/tools/notEquals.png",
    title: "Тэнцүү биш",
    operator: "NOT_EQUAL",
  },
  {
    logo: "/icons/tools/Contains.png",
    title: "Агуулсан",
    operator: "CONTAINS",
  },
  {
    logo: "/icons/tools/notContains.png",
    title: "Агуулагдаагүй",
    operator: "NOT_CONTAINS",
  },
  {
    logo: "/icons/tools/isGreetThan.png",
    title: "Их",
    operator: "IS_GREATER",
  },
  {
    logo: "/icons/tools/isGreetThanOrEqual.png",
    title: "Их буюу тэнцүү",
    operator: "IS_GREATOR_OR_EQUAL",
  },
  {
    logo: "/icons/tools/isLessThan.png",
    title: "Бага",
    operator: "IS_LESS",
  },
  {
    logo: "/icons/tools/isLessThanOrEqual.png",
    title: "Бага буюу тэнцүү",
    operator: "IS_LESS_OR_EQUAL",
  },
  {
    logo: "/icons/tools/Equals.png",
    title: "Тухайн",
    operator: "THAT",
  },
  {
    logo: "/icons/tools/Calendar.svg",
    title: "Хооронд",
    operator: "BETWEEN",
  },
  {
    logo: "/icons/tools/Calendar.svg",
    title: "Сонголтод",
    operator: "SELECTION",
  },
  {
    logo: "/icons/tools/Calendar.svg",
    title: "Жил",
    operator: "YEAR",
  },
  {
    logo: "/icons/tools/Calendar.svg",
    title: "Сар",
    operator: "MONTH",
  },
  {
    logo: "/icons/tools/Calendar.svg",
    title: "Улирал",
    operator: "QUARTER",
  },
];