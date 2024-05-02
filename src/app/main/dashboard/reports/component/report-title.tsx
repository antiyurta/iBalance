import { useReportContext } from "@/feature/context/ReportsContext";
import dayjs from "dayjs";
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
    if (values.dateFilter) {
      if (values.dateFilter.operator == "BETWEEN") {
        console.log(values);
        setReportAt(
          `${dayjs(values.dateFilter.startAt).format("YYYY/MM/DD")}-${dayjs(
            values.dateFilter.endAt
          ).format("YYYY/MM/DD")}`
        );
        // setReportAt(
        //   `${values.dateFilter.startAt.format(
        //     "YYYY/MM/DD"
        //   )} - ${values.dateFilter.endAt.format("YYYY/MM/DD")}`
        // );
      } else if (values.dateFilter.operator == "THAT") {
        setReportAt(dayjs(values.dateFilter.startAt).format("YYYY/MM/DD"));
        // setReportAt(`${values.dateFilter.startAt.format("YYYY/MM/DD")}`);
      } else if (values.dateFilter.operator == "IS_LESS") {
        setReportAt(
          dayjs(values.dateFilter.startAt).format("YYYY/MM/DD-хүртэл")
        );
        // setReportAt(`${values.dateFilter.startAt.format("YYYY/MM/DD")}-хүртэл`);
      } else if (values.dateFilter.operator == "IS_GREATER") {
        setReportAt(
          dayjs(values.dateFilter.startAt).format("YYYY/MM/DD-с хойшхи")
        );
        // setReportAt(
        //   `${values.dateFilter.startAt.format("YYYY/MM/DD")}-с хойшхи`
        // );
      }
      //  else if (values.dateFilter.operator == "SELECTION") {
      //   setReportAt(values.dateFilter.startAt.toString());
      // } else if (values.dateFilter.operator == "YEAR") {
      //   setReportAt(`${values.dateFilter.dates[0].format("YYYY")}-он`);
      // } else if (values.dateFilter.operator == "MONTH") {
      //   setReportAt(`${values.dateFilter.dates[0].format("YYYY/MM")}-сар`);
      // }
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
