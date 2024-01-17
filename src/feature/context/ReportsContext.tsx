import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { TabsProps } from "antd/lib";
import Image from "next/image";
import ReportList from "@/app/main/dashboard/reports/reportList";

interface Tab {
  label: ReactNode;
  key: string;
  children: ReactNode;
  closable?: boolean;
}

interface ReportContextProps {
  tabs: Tab[];
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  tabKey: string;
  setTabKey: Dispatch<SetStateAction<string>>
}

const ReportsContext = createContext<ReportContextProps | undefined>(undefined);

interface IProps {
  children: ReactNode;
}

const ProviderReport: React.FC<IProps> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      key: "item-1",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <Image
            src={"/icons/tools/report.svg"}
            width={16}
            height={16}
            alt="Тайлан"
          />
          Тайлан харах
        </div>
      ),
      children: <ReportList />,
      closable: false,
    },
  ]);
  const [tabKey, setTabKey] = useState<string>("item-1");
  const value: ReportContextProps = { tabs, setTabs, tabKey, setTabKey };
  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
};

const useReportContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ProviderReport");
  }
  return context;
};

export { ProviderReport, useReportContext };
