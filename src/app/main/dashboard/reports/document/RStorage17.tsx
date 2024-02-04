import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage2Filter from "../filters/RStorage2Filter";

const RStorage17 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage2Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage17;
