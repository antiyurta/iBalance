import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage5Filter from "../filters/RStorage5Filter";
import { useRef } from "react";

const RStorage6 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage5Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Татан авалтын дэлгэрэнгүй тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage6;
