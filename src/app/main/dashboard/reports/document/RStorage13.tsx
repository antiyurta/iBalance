import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage4Filter from "../filters/RStorage4Filter";

const RStorage13 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage4Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Материал хольц, найруулгын тайлан (гүйлгээгээр)"}
        />
      </div>
    </div>
  );
};
export default RStorage13;
