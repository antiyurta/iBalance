import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage1Filter from "../filters/RStorage1Filter";
import { useRef } from "react";

/** Бараа материалын товчоо тайлан (хураангуй) */
const RStorage2 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage1Filter/>} printRef={tableRef}/>
      <div className="report-body" ref={tableRef}>
        <ReportTitle organization={"Universal med"} title={"Бараа материалын товчоо тайлан (хураангуй)"} />
        <table className="report">
          <thead>
            <th>Дотоод код</th>
            <th>Бараа материалын нэр</th>
            <th>Багц доторх тоо</th>
            <th>Хэмжих нэгж</th>
            <th>Эхний үлдэгдэл</th>
            <th>Орлого</th>
            <th>Зарлага</th>
            <th>Эцсийн үлдэгдэл</th>
          </thead>
          <tbody>
            <tr>
              <td>Нярав</td>
              <td colSpan={7}>Бат</td>
            </tr>
            <tr>
              <td>Байршил</td>
              <td colSpan={7}>01  Яармаг</td>
            </tr>
          </tbody>
        </table>
      </div> 
    </div>
  );
};
export default RStorage2;
