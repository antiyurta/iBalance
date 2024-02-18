"use client";

import { Col, Row, Space, Tabs, Typography } from "antd";
import { useReportContext } from "@/feature/context/ReportsContext";
import PageTitle from "@/components/page-title";

const { Title } = Typography;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const Reports = () => {
  const { tabs, setTabs, tabKey, setTabKey } = useReportContext();
  const remove = (targetKey: TargetKey) => {
    let newActiveKey = tabKey;
    let lastIndex = -1;

    tabs?.forEach((item, i) => {
      if (item?.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const newPanes = tabs?.filter((item) => item?.key !== targetKey);

    if (newPanes?.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex]?.key ?? newPanes[0]?.key ?? "";
      } else {
        newActiveKey = newPanes[0]?.key ?? "";
      }
    }
    setTabs(newPanes);
    setTabKey(newActiveKey);
  };
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
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
            activeKey={tabKey}
            items={tabs}
            onChange={(key) => setTabKey(key)}
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
