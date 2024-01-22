import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage10 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)"}
        />
      </div>
    </div>
  );
};
export default RStorage10;
