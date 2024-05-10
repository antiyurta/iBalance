import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage2Filter from "../filters/RStorage2Filter";
import { useRef } from "react";

const RStorage5 = () => {
  const tableRef = useRef(null);
  return (
    <div className="report-document">
      <Tools filter={<RStorage2Filter/>} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={"Universal med"}
          title={"Агуулахын бүртгэл (гүйлгээний утгаар)"}
        />
        <table className="report">
          <thead>
            <th>Баримтын огноо</th>
            <th>Баримтын дугаар</th>
            <th>Гүйлгээний утга</th>
            <th>Харилцагчийн нэр</th>
            <th>Орлого</th>
            <th>Зарлага</th>
            <th>Үлдэгдэл</th>
            <th>Хянаж түгжсэн огноо</th>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>Нярав:</td>
              <td colSpan={7}>Бат</td>
            </tr>
            <tr>
              <td colSpan={2}>Байршил:</td>
              <td colSpan={7}>01 Яармаг</td>
            </tr>
            <tr>
              <td colSpan={2}>Барааны төрөл:</td>
              <td colSpan={7}>Бэлэн бүтээгдэхүүн-Төв агуулах</td>
            </tr>
            <tr>
              <td colSpan={2}>Бүлэг:</td>
              <td colSpan={7}>АР-ХӨН</td>
            </tr>
            <tr>
              <td colSpan={2}>Бараа:</td>
              <td colSpan={7}>1001 - Тайлол хот</td>
            </tr>
            <tr>
              <td>07.03.2023</td>
              <td>Б-102</td>
              <td>Борлуулалт</td>
              <td>Монос</td>
              <td>10</td>
              <td>1</td>
              <td>9</td>
              <td>05.04.2023</td>
            </tr>
          </tbody>
        </table>
        <div></div>
      </div>
    </div>
  );
};
export default RStorage5;
