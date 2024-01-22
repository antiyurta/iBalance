import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage18 = () => {
  return (
    <div className="report-document">
      <Tools />
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
