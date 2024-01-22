import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage15 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage15;
