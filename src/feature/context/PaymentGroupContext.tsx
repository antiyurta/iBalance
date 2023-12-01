import { ReactNode, createContext, useContext, useState } from "react";

export type TypeValue = number | "all";

export interface IMaterial {
  id: number;
  name: string;
  src: string;
}

type paymentGroupContext = {
  value: TypeValue;
  set: (value: TypeValue) => void;
  isReload: boolean;
  setReload: (state: boolean) => void;
  isReloadCart: boolean;
  setReloadCart: () => void;
};

const paymentGroupContextDefualtValues: paymentGroupContext = {
  value: "all",
  set: () => {},
  isReload: true,
  setReload: () => {},
  isReloadCart: false,
  setReloadCart: () => {},
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
  const [isReload, setIsReload] = useState<boolean>(true);
  const [isReloadCart, setIsReloadCart] = useState<boolean>(false);
  const set = (value: TypeValue) => {
    setValue(value);
  };
  const setReload = (state: boolean) => {
    setIsReload(state);
  };
  const setReloadCart = () => {
    setIsReloadCart(!isReloadCart);
  };
  return (
    <PaymentGroupContext.Provider
      value={{ value, set, isReload, setReload, isReloadCart, setReloadCart }}
    >
      {props.children}
    </PaymentGroupContext.Provider>
  );
}
