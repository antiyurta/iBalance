import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage2Filter from "../filters/RStorage2Filter";

const RStorage4 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage2Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулахын бүртгэл (гүйлгээний цонхоор)"}
        />
      </div>
    </div>
  );
};
export default RStorage4;
