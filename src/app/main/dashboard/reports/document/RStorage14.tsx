import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage5Filter from "../filters/RStorage5Filter";
import { useRef } from "react";

const RStorage14 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage5Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Акт, хорогдол, устгалын товчоо тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage14;
