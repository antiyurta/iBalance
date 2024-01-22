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
    if (values.interval) {
      if (
        values.interval.interval == "between" &&
        values.interval.dates &&
        values.interval.dates[0] &&
        values.interval.dates[1]
      ) {
        setReportAt(
          `${values.interval.dates[0].format(
            "YYYY/MM/DD"
          )} - ${values.interval.dates[1].format("YYYY/MM/DD")}`
        );
      } else if (values.interval.interval == "that" && values.interval.date) {
        setReportAt(`${values.interval.date.format("YYYY/MM/DD")}`);
      } else if (values.interval.interval == "until" && values.interval.date) {
        setReportAt(`${values.interval.date.format("YYYY/MM/DD")}-хүртэл`);
      } else if (values.interval.interval == "late" && values.interval.date) {
        setReportAt(`${values.interval.date.format("YYYY/MM/DD")}-с хойшхи`);
      } else if (
        values.interval.interval == "selection" &&
        values.interval.dates &&
        values.interval.dates?.length > 0
      ) {
        setReportAt(values.interval.dates.toString());
      } else if (values.interval.interval == "year" && values.interval.date) {
        setReportAt(`${values.interval.date.format("YYYY")}-он`);
      } else if (values.interval.interval == "month" && values.interval.date) {
        setReportAt(`${values.interval.date.format("YYYY/MM")}-сар`);
      }
    }
  }, [values.interval]);
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
            fontSize: 8,
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
            fontSize: 9,
          }}
        >
          Тайлант үе: {reportAt}
        </p>
      </div>
    </>
  );
};
