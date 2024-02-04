import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage4Filter from "../filters/RStorage4Filter";

const RStorage12 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage4Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)"}
        />
      </div>
    </div>
  );
};
export default RStorage12;
