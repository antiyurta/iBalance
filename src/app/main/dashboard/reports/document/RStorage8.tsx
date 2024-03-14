import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage1Filter from "../filters/RStorage1Filter";
import { useRef } from "react";

const RStorage8 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage1Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулах хоорондын хөдөлгөөний хураангуй тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage8;
