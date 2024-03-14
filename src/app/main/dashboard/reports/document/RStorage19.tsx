import { Tools } from "@/components/tools";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";
import { useRef } from "react";

const RStorage19 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage3Filter />} printRef={tableRef} />
      <div className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Тооллогын тайлан"}
        />
        <table className="report">
          <thead>
            <th>Дотоод код</th>
            <th>Бараа материалын нэр</th>
            <th>Багц доторх тоо</th>
            <th>Хэмжих нэгж</th>
            <th>Борлуулах үнэ</th>
            <th>Эцсийн үлдэгдэл</th>
            <th>Тооллогоорх үлдэгдэл</th>
            <th>Зөрүү</th>
            <th>Зөрүү дүн (борлуулах үнээр)</th>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>Нярав :</td>
              <td colSpan={7}>Бат</td>
            </tr>
            <tr>
              <td colSpan={2}>Байршил :</td>
              <td colSpan={7}>01 Яармаг</td>
            </tr>
            <tr>
              <td colSpan={2}>Барааны төрөл :</td>
              <td colSpan={7}>Бэлэн бүтээгдэхүүн- Төв агуулах</td>
            </tr>
            <tr>
              <td colSpan={2}>Бүлэг :</td>
              <td colSpan={7}>АР-ХӨН</td>
            </tr>
            <tr>
              <td>750023</td>
              <td>Архөн HY150</td>
              <td>1</td>
              <td>Ширхэг</td>
              <td>4500</td>
              <td>200</td>
              <td>200</td>
              <td>0</td>
              <td>400</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RStorage19;
