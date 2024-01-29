import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage1Filter from "../filters/RStorage1Filter";

const RStorage7 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage1Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)"}
        />
      </div>
    </div>
  );
};
export default RStorage7;
