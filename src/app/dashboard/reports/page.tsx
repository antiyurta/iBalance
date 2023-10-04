"use client";

import { BorderOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tabs, Typography } from "antd";
import ReportList from "./reportList";

const { Title } = Typography;

const Reports = () => {
  const items = [
    {
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
      key: "item-1",
      children: <ReportList />,
    },
    {
      label: "Бараа материалын товчоо тайлан",
      key: "item-2",
    },
  ];
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
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
    </div>
  );
};
export default Reports;
