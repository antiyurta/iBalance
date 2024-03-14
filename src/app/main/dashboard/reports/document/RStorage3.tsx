import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage2Filter from "../filters/RStorage2Filter";
import { useRef } from "react";

const RStorage3 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage2Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын гүйлгээний тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage3;
