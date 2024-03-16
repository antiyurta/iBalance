import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";
import { useRef } from "react";

const RStorage23 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage3Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын үлдэгдлийн тайлан /дуусах хугацаагаар/"}
        />
        <table className="report">
          <thead>
            <tr>
              <th rowSpan={2}>Дотоод код</th>
              <th rowSpan={2}>Бараа материалын нэр</th>
              <th rowSpan={2}>Хэмжих нэгж</th>
              <th rowSpan={2}>Багц доторх тоо</th>
              <th rowSpan={2}>Эцсийн үлдэгдэл</th>
              <th rowSpan={2}>Хугацаа дууссан</th>
              <th rowSpan={2}>Хугацаа дуусаагүй</th>
              <th colSpan={6}>Хугацаа дуусахад үлдсэн хоног (үлдэгдэлээр)</th>
            </tr>
            <tr>
              <th>0-30 хоног</th>
              <th>31-60 хоног</th>
              <th>61-90 хоног</th>
              <th>91-180 хоног</th>
              <th>180-365 хоног</th>
              <th>365 хоногоос дээш</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>Нярав :</td>
              <td colSpan={11}>Бат</td>
            </tr>
            <tr>
              <td colSpan={2}>Байршил :</td>
              <td colSpan={11}>Бат</td>
            </tr>
            <tr>
              <td colSpan={2}>Барааны төрөл :</td>
              <td colSpan={11}>Бэлэн бүтээгдэхүүн- Төв агуулах</td>
            </tr>
            <tr>
              <td colSpan={2}>Бүлэг :</td>
              <td colSpan={11}>АР-ХӨН</td>
            </tr>
            <tr>
              <td>750023</td>
              <td>Архөн HY150</td>
              <td>Ширхэг</td>
              <td>6 000</td>
              <td>0</td>
              <td>6 000</td>
              <td>600</td>
              <td>600</td>
              <td>600</td>
              <td>600</td>
              <td>600</td>
              <td>600</td>
              <td>1200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RStorage23;
