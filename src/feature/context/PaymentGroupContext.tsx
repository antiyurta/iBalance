import { ReactNode, createContext, useContext, useState } from "react";

export type TypeValue = number | "all";

type paymentGroupContext = {
  value: TypeValue;
  set: (value: TypeValue) => void;
};

const paymentGroupContextDefualtValues: paymentGroupContext = {
  value: "all",
  set: () => {},
};

const PaymentGroupContext = createContext<paymentGroupContext>(
  paymentGroupContextDefualtValues
);
export function usePaymentGroupContext() {
  return useContext(PaymentGroupContext);
}
interface IProps {
  children: ReactNode;
}

export function PaymentGroupProvider(props: IProps) {
  const [value, setValue] = useState<TypeValue>("all");
  const set = (value: TypeValue) => {
    setValue(value);
  };
  return (
    <PaymentGroupContext.Provider value={{ value, set }}>
      {props.children}
    </PaymentGroupContext.Provider>
  );
}
