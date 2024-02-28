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
