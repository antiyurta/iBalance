"use client";

import { BorderOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tabs, Typography } from "antd";
import ReportList from "./reportList";
import { useEffect, useState } from "react";
import { TabsProps } from "antd/lib";
import { useReportContext } from "@/feature/context/ReportsContext";

const { Title } = Typography;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const Reports = () => {
  const { item } = useReportContext();
  const [activeKey, setActiveKey] = useState<string>("item-1");
  const [tabsItems, setTabsItems] = useState<TabsProps["items"]>([
    {
      key: "item-1",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <BorderOutlined />
          Тайлан харах
        </div>
      ),
      children: <ReportList />,
      closable: false,
    },
  ]);
  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabsItems?.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabsItems?.filter((item) => item.key !== targetKey);
    if (newPanes?.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabsItems(newPanes);
    setActiveKey(newActiveKey);
  };
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
  };
  useEffect(() => {
    if (item) {
      if (!tabsItems?.find((tab) => tab.key === item?.key)) {
        setTabsItems((tabsItems: TabsProps["items"]) => {
          if (tabsItems) {
            return [
              ...tabsItems,
              {
                key: item?.key,
                label: item?.title,
                children: item?.children,
              },
            ];
          }
        });
      }
      setActiveKey(item.key);
    }
  }, [item]);
  return (
    <div>
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Space size={24}>
            <Title level={2}>Тайлан / Агуулахын тайлан</Title>
          </Space>
        </Col>
        <Col span={24}>
          <Tabs
            className="lineTop"
            activeKey={activeKey}
            items={tabsItems}
            onChange={(key) => setActiveKey(key)}
            destroyInactiveTabPane={true}
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
