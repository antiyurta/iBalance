import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

/** Бараа материалын товчоо тайлан (хураангуй) */
const RStorage2 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle organization={"Universal med"} title={"Бараа материалын товчоо тайлан (хураангуй)"} />
      </div>
    </div>
  );
};
export default RStorage2;
