import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage1Filter from "../filters/RStorage1Filter";

const RStorage8 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage1Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулах хоорондын хөдөлгөөний хураангуй тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage8;
