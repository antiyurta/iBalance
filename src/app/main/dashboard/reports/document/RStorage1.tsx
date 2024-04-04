import { CSSProperties, useEffect, useRef, useState } from "react";
import * as XLSX from "sheetjs-style";
import { usePDF } from "react-to-pdf";
import * as headerJSON from "./excel/RStorage1";
import { NextPage } from "next";
import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { useReportContext } from "@/feature/context/ReportsContext";
import { ReportTitle } from "../component/report-title";
import RStorage1Filter from "../filters/RStorage1Filter";
import { ReportService } from "@/service/report/service";
import { IReportMaterial } from "@/service/report/entities";
import { useTypedSelector } from "@/feature/store/reducer";
import { Divider } from "antd";
const textRight: CSSProperties = { textAlign: "right" };
interface IWarehouse {
  warehouseName?: string;
  sections: ISection[];
}
interface ISection {
  sectionName?: string;
  materials: IReportMaterial[];
}
type MaterialProps = {
  material: IReportMaterial;
};
const RowMaterial: React.FC<MaterialProps> = ({ material }) => (
  <tr>
    <td>{material.code}</td>
    <td>{material.name}</td>
    <td>{material.shortName}</td>
    <td style={textRight}>{material.beginingQty}</td>
    <td style={textRight}>{material.purchaseQty}</td>
    <td style={textRight}>{material.refundQty}</td>
    <td style={textRight}>{material.warehouseIncomeQty}</td>
    <td style={textRight}>{material.incomeQty}</td>
    <td style={textRight}>{material.saleQty}</td>
    <td style={textRight}>{material.operationQty}</td>
    <td style={textRight}>{material.purchaseReturnQty}</td>
    <td style={textRight}>{material.actQty}</td>
    <td style={textRight}>{material.warehouseExpenseQty}</td>
    <td style={textRight}>{material.expenseQty}</td>
    <td style={textRight}>{material.lastQty}</td>
  </tr>
);
/** Бараа материалын товчоо тайлан */
const RStorage1: NextPage = () => {
  const tableRef = useRef(null);
  const { activeKey, items } = useTypedSelector((state) => state.reportPanel);
  const currentItem = items.find((item) => item.key == activeKey);
  const { hospital } = useTypedSelector((state) => state.user);
  const [data, setData] = useState<IReportMaterial[]>([]);
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
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
  const getWarehouseMaterials = (warehouse: IWarehouse): IReportMaterial[] => {
    const repMaterials: IReportMaterial[] = [];
    warehouse.sections.map((item) => repMaterials.push(...item.materials));
    return repMaterials;
  };
  useEffect(() => {
    if (currentItem && currentItem.param?.dateFilter) {
      ReportService.reportMaterial(currentItem.param).then((response) => {
        setData(response.response);
      });
    }
  }, [currentItem?.param]);
  useEffect(() => {
    const groupedData: IWarehouse[] = [];
    data.forEach((material) => {
      let warehouse = groupedData.find(
        (wh) => wh.warehouseName === material.warehouseName
      );
      if (!warehouse) {
        warehouse = { warehouseName: material.warehouseName, sections: [] };
        groupedData.push(warehouse);
      }

      let section = warehouse.sections.find(
        (sec) => sec.sectionName === material.sectionName
      );
      if (!section) {
        section = {
          sectionName: material.sectionName,
          materials: [],
        };
        warehouse.sections.push(section);
      }

      section.materials.push(material);
      setWarehouses(groupedData);
    });
  }, [data]);
  return (
    <div className="report-document">
      <Tools
        filter={<RStorage1Filter reportKey="item-1" />}
        printRef={tableRef}
      />
      <div ref={tableRef} className="report-body">
        <ReportTitle
          organization={hospital?.name || ""}
          title={"Бараа материалын товчоо тайлан"}
        />
        <table className="report">
          <thead>
            <tr>
              <th rowSpan={2}>Дотоод код</th>
              <th rowSpan={2}>Бараа материалын нэр</th>
              <th rowSpan={2}>Хэмжих нэгж</th>
              <th rowSpan={2}>Эхний үлдэгдэл</th>
              <th colSpan={4}>Орлого</th>
              <th rowSpan={2}>Нийт орлого</th>
              <th colSpan={6}>Зарлага</th>
              <th rowSpan={2}>Нийт зарлага</th>
              <th rowSpan={2}>Эцсийн үлдэгдэл</th>
            </tr>
            <tr>
              <th>Бараа материалын орлого</th>
              <th>Борлуулалтын буцаалт</th>
              <th>Дотоод гүйлгээ</th>
              <th>Тооллого</th>
              <th>Борлуулалт</th>
              <th>Үйл ажиллагаанд</th>
              <th>Худалдан авалтын буцаалт</th>
              <th>Акт, хорогдол</th>
              <th>Дотоод гүйлгээ</th>
              <th>Тооллого</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse, windex) => (
              <>
                {currentItem?.param?.isWarehouse && (
                  <tr key={windex} style={{ fontWeight: "bold" }}>
                    <td>Байршил : </td>
                    <td colSpan={16}>{warehouse.warehouseName}</td>
                  </tr>
                )}
                {warehouse.sections.map((section, sindex) => (
                  <>
                    {currentItem?.param?.isSection && (
                      <tr
                        key={`${windex}-${sindex}`}
                        style={{ fontWeight: "bold" }}
                      >
                        <td>Бүлэг :</td>
                        <td colSpan={16}>{section.sectionName}</td>
                      </tr>
                    )}
                    {section.materials.map((item, index) => (
                      <tr key={`${windex}-${sindex}-${index}`}>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.shortName}</td>
                        <td style={textRight}>{item.beginingQty}</td>
                        <td style={textRight}>{item.purchaseQty}</td>
                        <td style={textRight}>{item.refundQty}</td>
                        <td style={textRight}>{item.warehouseIncomeQty}</td>
                        <td style={textRight}>{item.cencusIncomeQty}</td>
                        <td style={textRight}>{item.incomeQty}</td>
                        <td style={textRight}>{item.saleQty}</td>
                        <td style={textRight}>{item.operationQty}</td>
                        <td style={textRight}>{item.purchaseReturnQty}</td>
                        <td style={textRight}>{item.actQty}</td>
                        <td style={textRight}>{item.warehouseExpenseQty}</td>
                        <td style={textRight}>{item.cencusExpenseQty}</td>
                        <td style={textRight}>{item.expenseQty}</td>
                        <td style={textRight}>{item.lastQty}</td>
                      </tr>
                    ))}
                    {currentItem?.param?.isSection && (
                      <tr style={{ fontWeight: "bold" }}>
                        <td colSpan={3}>Бүлгийн тоо хэмжээ</td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.beginingQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.purchaseQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.refundQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.warehouseIncomeQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.cencusIncomeQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.incomeQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.saleQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.operationQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.purchaseReturnQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.actQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.warehouseExpenseQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.cencusExpenseQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.expenseQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.lastQty),
                            0
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {currentItem?.param?.isWarehouse && (
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan={3}>Байршлын тоо хэмжээ</td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.beginingQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.purchaseQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.refundQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) =>
                          total + Number(item.warehouseIncomeQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.cencusIncomeQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.incomeQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.saleQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.operationQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.purchaseReturnQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.actQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) =>
                          total + Number(item.warehouseExpenseQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.cencusExpenseQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.expenseQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.lastQty),
                        0
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
            <tr style={{ fontWeight: "bold" }}>
              <td colSpan={3}>НИЙТ ТОО ХЭМЖЭЭ</td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.beginingQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.purchaseQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.refundQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.warehouseIncomeQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.cencusIncomeQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.incomeQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce((total, item) => total + Number(item.saleQty), 0)}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.operationQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.purchaseReturnQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce((total, item) => total + Number(item.actQty), 0)}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.warehouseExpenseQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.cencusExpenseQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce(
                  (total, item) => total + Number(item.expenseQty),
                  0
                )}
              </td>
              <td style={textRight}>
                {data.reduce((total, item) => total + Number(item.lastQty), 0)}
              </td>
            </tr>
          </tbody>
        </table>
        <Divider />
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <span style={textRight}>
            Агуулах хариуцсан нярав:............../.............../
          </span>
          <span style={textRight}>
            Хянасан нягтлан бодогч:.............../.............../
          </span>
        </div>
      </div>
    </div>
  );
};
export default RStorage1;
