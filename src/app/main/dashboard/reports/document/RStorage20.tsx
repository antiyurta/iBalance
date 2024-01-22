import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage20 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Тооллогын хуудас"}
        />
      </div>
    </div>
  );
};
export default RStorage20;
