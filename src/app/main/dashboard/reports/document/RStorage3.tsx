import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage3 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын гүйлгээний тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage3;
