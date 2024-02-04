import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage6Filter from "../filters/RStorage6Filter";

const RStorage9 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage6Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage9;
