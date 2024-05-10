import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage6Filter from "../filters/RStorage6Filter";
import { useRef } from "react";

const RStorage9 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage6Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage9;
