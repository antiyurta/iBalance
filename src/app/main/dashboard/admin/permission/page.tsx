"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { TabsProps } from "antd/lib";
import { useState } from "react";
import { Role } from "./role";
const { Title } = Typography;
const Permission = () => {
  const [activeKey, setActiveKey] = useState<string>("item-1");
  const items: TabsProps["items"] = [
    {
      key: "item-1",
      label: "Эрхийн зөвшөөрөл",
      children: <Role />,
    },
    {
      key: "item-2",
      label: "Хэрэглэгчийн зөвшөөрөл",
    },
  ];
  return (
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>Админ / Хэрэглэгчийн эрхийн тохиргоо</Title>
        </Space>
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default Permission;
