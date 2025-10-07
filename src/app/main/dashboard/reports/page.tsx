"use client";
import { Col, Row, Tabs } from "antd";
import { useReportContext } from "@/feature/context/ReportsContext";
import PageTitle from "@/components/page-title";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { removePanel, savePanel } from "@/feature/store/slice/report.slice";
import Report from "./report";
import Image from "next/image";
import { useEffect } from "react";
import { reportList } from "./data";
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
interface Tab {
  label: React.ReactNode;
  key: string;
  children: React.ReactNode;
  closable?: boolean;
}
const Reports = () => {
  const { activeKey, items } = useTypedSelector((state) => state.reportPanel);
  const tabs: Tab[] = [
    {
      key: "item-0",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <Image
            src={"/icons/tools/report.svg"}
            width={16}
            height={16}
            alt="Тайлан"
          />
          Тайлан харах
        </div>
      ),
      children: <Report />,
      closable: false,
    },
    ...reportList
      .filter((report) => items.map((item) => item.key).includes(report.key))
      .map((item) => ({
        key: item.key,
        label: item.title,
        children: item.children,
        closeable: true,
      })),
  ];
  const dispatch = useDispatch<AppDispatch>();
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      dispatch(removePanel(targetKey.toString()));
    }
  };
  const onChange = (key: string) => {
    const currentIndex = items.findIndex((item) => item.key == key);
    dispatch(savePanel({ key, param: items[currentIndex].param }));
  };
  return (
    <div>
      <PageTitle />
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Tabs
            className="lineTop"
            activeKey={activeKey}
            items={tabs}
            onChange={onChange}
            onEdit={onEdit}
            hideAdd={true}
            type="editable-card"
          />
        </Col>
      </Row>
    </div>
  );
};
export default Reports;
