"use client";
import { ProviderReport } from "@/feature/context/ReportsContext";
import { ReactNode } from "react";
interface IProps {
  children: ReactNode;
}
const ReportLayout: React.FC<IProps> = ({ children }) => {
  return <ProviderReport>
    {children}
    </ProviderReport>;
};
export default ReportLayout;
