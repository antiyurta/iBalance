import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";

const RStorage18 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage3Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)"}
        />
      </div>
    </div>
  );
};
export default RStorage18;
