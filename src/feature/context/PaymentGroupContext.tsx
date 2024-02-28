import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useTypedSelector } from "../store/reducer";

interface IPaymentContextProps {
  sectionId?: number;
  setSectionId: Dispatch<SetStateAction<number | undefined>>;
  payAmount: number; // төлөх дүн
  paidAmount: number; // төлсөн дүн
}
const PaymentGroupContext = createContext<IPaymentContextProps | undefined>(
  undefined
);
interface IProps {
  children: ReactNode;
}
const ProviderPaymentGroup: React.FC<IProps> = ({ children }) => {
  const [sectionId, setSectionId] = useState<number>();
  const goods = useTypedSelector((state) => state.shoppingGoods);
  const { invoices } = useTypedSelector((state) => state.shoppingCart);
  const payAmount = goods.reduce((total, item) => total + item.payAmount, 0);
  const paidAmount = invoices.reduce((total, item) => total + item.payAmount, 0);
  const value: IPaymentContextProps = {
    payAmount,
    paidAmount,
    sectionId,
    setSectionId,
  };
  return (
    <PaymentGroupContext.Provider value={value}>
      {children}
    </PaymentGroupContext.Provider>
  );
};
const usePaymentContext = () => {
  const context = useContext(PaymentGroupContext);
  if (!context) {
    throw new Error(
      "usePaymentContext must be used within a ProviderPaymentGroup"
    );
  }
  return context;
};
export { ProviderPaymentGroup, usePaymentContext };
