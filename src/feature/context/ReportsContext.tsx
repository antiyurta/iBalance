import { ReactNode, createContext, useContext, useState } from "react";

type itemType = {
  title: ReactNode;
  key: string;
  children: ReactNode;
};

type reportContext = {
  item: itemType | undefined;
  set: (item: itemType) => void;
};

const reportContextDefualtValues: reportContext = {
  item: undefined,
  set: () => {},
};

const ReportsContext = createContext<reportContext>(reportContextDefualtValues);
export function useReportContext() {
  return useContext(ReportsContext);
}
interface IProps {
  children: ReactNode;
}

export function ReportProvider(props: IProps) {
  const [item, setItem] = useState<itemType>();
  const set = (item: itemType) => {
    setItem(item);
  };
  return (
    <ReportsContext.Provider value={{ item, set }}>
      {props.children}
    </ReportsContext.Provider>
  );
}
