import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";

const RStorage22 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage3Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/"}
        />
      </div>
    </div>
  );
};
export default RStorage22;
