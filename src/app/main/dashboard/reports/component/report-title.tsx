import { useReportContext } from "@/feature/context/ReportsContext";
import React, { useEffect, useState } from "react";
interface IProps {
  organization: string;
  title: string;
}
export const ReportTitle: React.FC<IProps> = ({ organization, title }) => {
  const { form } = useReportContext();
  const values = form.getFieldsValue();
  const [reportAt, setReportAt] = useState<string>("");
  useEffect(() => {
    if (
      values.dateFilter &&
      values.dateFilter.dates &&
      values.dateFilter.dates.length > 0
    ) {
      if (values.dateFilter.operator == "BETWEEN") {
        setReportAt(
          `${values.dateFilter.dates[0].format(
            "YYYY/MM/DD"
          )} - ${values.dateFilter.dates[1].format("YYYY/MM/DD")}`
        );
      } else if (values.dateFilter.operator == "THAT") {
        setReportAt(`${values.dateFilter.dates[0].format("YYYY/MM/DD")}`);
      } else if (values.dateFilter.operator == "IS_LESS") {
        setReportAt(
          `${values.dateFilter.dates[0].format("YYYY/MM/DD")}-хүртэл`
        );
      } else if (values.dateFilter.operator == "IS_GREATER") {
        setReportAt(
          `${values.dateFilter.dates[0].format("YYYY/MM/DD")}-с хойшхи`
        );
      } else if (values.dateFilter.operator == "SELECTION") {
        setReportAt(values.dateFilter.dates.toString());
      } else if (values.dateFilter.operator == "YEAR") {
        setReportAt(`${values.dateFilter.dates[0].format("YYYY")}-он`);
      } else if (values.dateFilter.operator == "MONTH") {
        setReportAt(`${values.dateFilter.dates[0].format("YYYY/MM")}-сар`);
      }
    }
  }, [values.dateFilter]);
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontStyle: "italic",
          }}
        >
          {organization}
        </p>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        <p>{title}</p>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 12,
          }}
        >
          Тайлант үе: {reportAt}
        </p>
      </div>
    </>
  );
};
