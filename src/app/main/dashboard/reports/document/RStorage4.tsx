import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";

const RStorage4 = () => {
  return (
    <div className="report-document">
      <Tools />
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
