import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage5Filter from "../filters/RStorage5Filter";

const RStorage14 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage5Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Акт, хорогдол, устгалын товчоо тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage14;
