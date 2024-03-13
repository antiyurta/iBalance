import { CSSProperties, useEffect, useRef, useState } from "react";
import * as XLSX from "sheetjs-style";
import { usePDF } from "react-to-pdf";
import * as headerJSON from "./excel/RStorage1";
import { NextPage } from "next";
import { Tools } from "@/components/tools";
import { useReportContext } from "@/feature/context/ReportsContext";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { ReportTitle } from "../component/report-title";
import RStorage1Filter from "../filters/RStorage1Filter";
import { ReportService } from "@/service/report/service";
import { IReportMaterial } from "@/service/report/entities";
/** Бараа материалын товчоо тайлан */
const RStorage1: NextPage = () => {
  const tableRef = useRef(null);
  const { form } = useReportContext();
  const values = form.getFieldsValue();
  const [reportAt, setReportAt] = useState<string>("");
  const [warehouse, setWarehouse] = useState<IDataWarehouse>();
  const [data, setData] = useState<IReportMaterial[]>([]);
  const textRight: CSSProperties = { textAlign: 'right' }
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const toExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [headerJSON.header], { origin: "K2" });
    XLSX.utils.sheet_add_aoa(ws, [headerJSON.title], { origin: "B3" });
    XLSX.utils.sheet_add_aoa(ws, [headerJSON.date], { origin: "B4" });
    XLSX.utils.sheet_add_aoa(ws, [headerJSON.column], { origin: "B6" });
    XLSX.utils.sheet_add_aoa(ws, [headerJSON.column2], { origin: "B7" });
    const merge = [
      { s: { r: 1, c: 10 }, e: { r: 1, c: 15 } }, //compay ner
      { s: { r: 2, c: 1 }, e: { r: 2, c: 15 } }, // document name
      { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } }, // dotood code
      { s: { r: 5, c: 2 }, e: { r: 6, c: 2 } }, // baraa
      { s: { r: 5, c: 3 }, e: { r: 6, c: 3 } }, // negj
      { s: { r: 5, c: 4 }, e: { r: 6, c: 4 } }, // ehnii
      { s: { r: 5, c: 5 }, e: { r: 5, c: 7 } }, // orlogo
      { s: { r: 5, c: 8 }, e: { r: 6, c: 8 } }, // niit orlogo
      { s: { r: 5, c: 9 }, e: { r: 5, c: 13 } }, // zarlaga
      { s: { r: 5, c: 14 }, e: { r: 6, c: 14 } }, // nitt zarlga
      { s: { r: 5, c: 15 }, e: { r: 6, c: 15 } }, // etssin uldegdel
    ];
    ws["!merges"] = merge;
    ws["!cols"] = [
      { width: 3.86 },
      { width: 12.29 },
      { width: 18.43 },
      { width: 7.57 },
      { width: 9.43 },
    ];
    const arr = [
      {
        firstname: "sadsa",
      },
    ];
    XLSX.utils.sheet_add_json(ws, arr, { origin: "B9", skipHeader: true });
    XLSX.utils.sheet_add_aoa(ws, [headerJSON.footer]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "filename.xlsx");
  };
  // useEffect(() => {
  //   if (values.warehouseId)
  //     WarehouseService.getById(values.warehouseId).then((response) =>
  //       setWarehouse(response.response)
  //     );
  // }, [values.warehouseId]);
  useEffect(() => {
    ReportService.reportMaterial(values).then((response) => {
      setData(response.response);
    });
  }, []);
  return (
    <div className="report-document">
      <Tools filter={<RStorage1Filter />} />
      <div ref={targetRef} className="report-body">
        <ReportTitle
          organization={"Universal med"}
          title={"Бараа материалын товчоо тайлан"}
        />
        <table ref={tableRef} className="report">
          <thead>
            <tr>
              <th rowSpan={2}>Дотоод код</th>
              <th rowSpan={2}>Бараа материалын нэр</th>
              <th rowSpan={2}>Хэмжих нэгж</th>
              <th rowSpan={2}>Эхний үлдэгдэл</th>
              <th colSpan={3}>Орлого</th>
              <th rowSpan={2}>Нийт орлого</th>
              <th colSpan={5}>Зарлага</th>
              <th rowSpan={2}>Нийт зарлага</th>
              <th rowSpan={2}>Эцсийн үлдэгдэл</th>
            </tr>
            <tr>
              <th>Бараа материалын орлого</th>
              <th>Борлуулалтын буцаалт</th>
              <th>Дотоод хөдөлгөөн</th>
              <th>Борлуулалт</th>
              <th>Үйл ажиллагаанд</th>
              <th>Худалдан авалтын буцаалт</th>
              <th>Акт, хорогдол</th>
              <th>Дотоод хөдөлгөөн</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Нярав :</td>
              <td colSpan={14}>Бат</td>
            </tr>
            <tr>
              <td>Байршил :</td>
              <td colSpan={14}>{warehouse?.name}</td>
            </tr>
            <tr>
              <td>Барааны төрөл :</td>
              <td colSpan={14}>Бэлэн бүтээгдэхүүн- Төв агуулах</td>
            </tr>
            <tr>
              <td>Бүлэг :</td>
              <td colSpan={14}>АР-ХӨН</td>
            </tr>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.shortName}</td>
                <td style={textRight}>{item.beginingQty}</td>
                <td style={textRight}>{item.purchaseQty}</td>
                <td style={textRight}>{item.saleReturnQty}</td>
                <td style={textRight}>{item.warehouseIncomeQty}</td>
                <td style={textRight}>{item.incomeQty}</td>
                <td style={textRight}>{item.posQty}</td>
                <td style={textRight}>{item.operationQty}</td>
                <td style={textRight}>{item.saleReturnQty}</td>
                <td style={textRight}>{item.actQty}</td>
                <td style={textRight}>{item.warehouseExpenseQty}</td>
                <td style={textRight}>{item.expenseQty}</td>
                <td style={textRight}>{item.lastQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RStorage1;
