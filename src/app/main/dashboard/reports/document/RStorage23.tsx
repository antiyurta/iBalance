import { Tools } from "@/app/main/dashboard/reports/component/tools";
import { ReportTitle } from "../component/report-title";
import RStorage3Filter from "../filters/RStorage3Filter";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useTypedSelector } from "@/feature/store/reducer";
import { ReportService } from "@/service/report/service";
import { IReportEndatMaterial } from "@/service/report/entities";
interface IWarehouse {
  warehouseName?: string;
  sections: ISection[];
}
interface ISection {
  sectionName?: string;
  materials: IReportEndatMaterial[];
}
const textRight: CSSProperties = { textAlign: "right" };
const RStorage23 = () => {
  const tableRef = useRef(null);
  const { activeKey, items } = useTypedSelector((state) => state.reportPanel);
  const currentItem = items.find((item) => item.key == activeKey);
  const { hospital } = useTypedSelector((state) => state.user);
  const [data, setData] = useState<IReportEndatMaterial[]>([]);
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);

  const getWarehouseMaterials = (
    warehouse: IWarehouse
  ): IReportEndatMaterial[] => {
    const repMaterials: IReportEndatMaterial[] = [];
    warehouse.sections.map((item) => repMaterials.push(...item.materials));
    return repMaterials;
  };

  useEffect(() => {
    if (currentItem && currentItem.param?.filterAt) {
      ReportService.reportEndatMaterial(currentItem.param).then((response) => {
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
      <Tools filter={<RStorage3Filter />} printRef={tableRef} />
      <div className="report-body" ref={tableRef}>
        <ReportTitle
          organization={hospital?.name || ""}
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
            {warehouses.map((warehouse, windex) => (
              <React.Fragment key={windex}>
                {currentItem?.param?.isWarehouse && (
                  <tr key={windex} style={{ fontWeight: "bold" }}>
                    <td>Байршил : </td>
                    <td colSpan={12}>{warehouse.warehouseName}</td>
                  </tr>
                )}
                {warehouse.sections.map((section, sindex) => (
                  <React.Fragment key={sindex}>
                    {currentItem?.param?.isSection && (
                      <tr
                        key={`${windex}-${sindex}`}
                        style={{ fontWeight: "bold" }}
                      >
                        <td>Бүлэг :</td>
                        <td colSpan={12}>{section.sectionName}</td>
                      </tr>
                    )}
                    {section.materials.map((item, index) => (
                      <tr key={`${windex}-${sindex}-${index}`}>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.shortName}</td>
                        <td style={textRight}>{item.countPackage}</td>
                        <td style={textRight}>{item.lastQty ?? 0}</td>
                        <td style={textRight}>{item.expiredQty}</td>
                        <td style={textRight}>{item.noExpireQty}</td>
                        <td style={textRight}>{item.monthExpireQty}</td>
                        <td style={textRight}>{item.twoMonthExpireQty}</td>
                        <td style={textRight}>{item.quarterExpireQty}</td>
                        <td style={textRight}>{item.halfYearQty}</td>
                        <td style={textRight}>{item.yearQty}</td>
                        <td style={textRight}>{item.moreYearQty}</td>
                      </tr>
                    ))}
                    {currentItem?.param?.isSection && (
                      <tr style={{ fontWeight: "bold" }}>
                        <td colSpan={5}>Бүлгийн тоо хэмжээ</td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.expiredQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.noExpireQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.monthExpireQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.twoMonthExpireQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) =>
                              total + Number(item.quarterExpireQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.halfYearQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.yearQty),
                            0
                          )}
                        </td>
                        <td style={textRight}>
                          {section.materials.reduce(
                            (total, item) => total + Number(item.moreYearQty),
                            0
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {currentItem?.param?.isWarehouse && (
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan={5}>Байршлын тоо хэмжээ</td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.expiredQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.noExpireQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.monthExpireQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.twoMonthExpireQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.quarterExpireQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.halfYearQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.yearQty),
                        0
                      )}
                    </td>
                    <td style={textRight}>
                      {getWarehouseMaterials(warehouse).reduce(
                        (total, item) => total + Number(item.moreYearQty),
                        0
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RStorage23;
