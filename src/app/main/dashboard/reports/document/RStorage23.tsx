import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage23 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын үлдэгдэл тайлан /дуусах хугацаагаар/"}
        />
      </div>
    </div>
  );
};
export default RStorage23;
