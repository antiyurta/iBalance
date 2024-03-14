import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";
import { useRef } from "react";

const RStorage20 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage3Filter />} printRef={tableRef}/>
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Тооллогын хуудас"}
        />
      </div>
    </div>
  );
};
export default RStorage20;
