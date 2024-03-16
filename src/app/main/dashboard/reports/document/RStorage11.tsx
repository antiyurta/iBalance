import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage4Filter from "../filters/RStorage4Filter";
import { useRef } from "react";

const RStorage11 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage4Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Материал хөрвүүлэлтийн тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage11;
