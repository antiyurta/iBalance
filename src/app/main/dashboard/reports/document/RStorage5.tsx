import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage5 = () => {
  return (
    <div className="report-document">
      <Tools />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулахын бүртгэл (гүйлгээний утгаар)"}
        />
      </div>
    </div>
  );
};
export default RStorage5;
