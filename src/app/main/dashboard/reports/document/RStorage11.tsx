import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage11 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Материал хөрвүүлэлтийн тайлан (бараагаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage11;
