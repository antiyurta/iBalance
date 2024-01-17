import { RootState, useTypedSelector } from "@/feature/store/reducer";
import {
  SearchOutlined,
  AreaChartOutlined,
  UserAddOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Typography } from "antd";
import { useRef } from "react";
import * as XLSX from "sheetjs-style";
import { usePDF } from "react-to-pdf";
import * as headerJSON from "./excel/RStorage1";
import { DocumentService } from "@/service/document/service";
import { GetServerSideProps, NextPage } from "next";
import { IDataDocument } from "@/service/document/entities";
import Image from "next/image";
import { Tools } from "@/components/tools";
const { Title } = Typography;
interface SSRProps {
  data: IDataDocument[];
}
export const getServerSideProps: GetServerSideProps<SSRProps> = async () => {
  return await DocumentService.get({}).then((response) => {
    if (!response.success) return { props: { data: [] } };
    return { props: { data: response.response.data } };
  });
};
const RStorage1: NextPage<SSRProps> = ({ data }) => {
  const tableRef = useRef(null);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { RStorage1 } = useTypedSelector((state: RootState) => state.report);
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
  return (
    <div className="report-document">
      <Tools />
      <div className="report-filter">
        <Title level={3}>Хэрэгслүүд</Title>
        <Button
          type="default"
          icon={
            <Image
              src={"/images/filterFalse.svg"}
              width={24}
              height={24}
              alt="filter"
            />
          }
          style={{ width: "100%" }}
        >
          Бүлэглэлт
        </Button>
        <button onClick={() => toPDF()}>TO PDF</button>
        <button onClick={() => toExcel()}>TO EXCEL</button>
        <div
          style={{
            width: "100%",
            height: 1,
            background: "red",
          }}
        />
      </div>
      <div ref={targetRef} className="report-body">
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          <p></p>
          <p
            style={{
              fontSize: 8,
              fontStyle: "italic",
            }}
          >
            {RStorage1.warehouseId}
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          <p>Бараа материалын товчоо тайлан</p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: 9,
            }}
          >
            Тайлант үе: 2023/03/01 - 2023/03/31
          </p>
        </div>
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
              <td>750023</td>
              <td>Архөн HY150</td>
              <td>Ширхэг</td>
              <td>220</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>220</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>220</td>
              <td>220</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RStorage1;
