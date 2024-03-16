import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage2Filter from "../filters/RStorage2Filter";
import { useRef } from "react";

const RStorage17 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage2Filter />} printRef={tableRef}/>
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage17;
