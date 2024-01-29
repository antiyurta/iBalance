import { Tools } from "@/components/tools";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";
const RStorage21 = () => {
  return (
    <div className="report-document">
      <Tools filter={<RStorage3Filter />} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын насжилтын тайлан"}
        />
      </div>
    </div>
  );
};
export default RStorage21;
