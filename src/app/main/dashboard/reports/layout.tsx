"use client";
import { ReportProvider } from "@/feature/context/ReportsContext";
import { ReactNode } from "react";

const ReportLayout = ({ children }: { children: ReactNode }) => {
  return <ReportProvider>{children}</ReportProvider>;
};
export default ReportLayout;
