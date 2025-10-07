"use client";

import { NewSearch } from "@/components/input";
import { Col, Row, Space, Tabs, Typography } from "antd";

const { Title } = Typography;
import { DocumentList } from "../document-list";
import { TransactionList } from "../transaction-list";
const page = () => {
  const items = [
    {
      label: "Баримтын жагсаалт",
      key: "item-1",
      children: <DocumentList />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-2",
      children: <TransactionList />,
    },
  ];
  return (
    <Row
      style={{
        paddingTop: 16,
      }}
      gutter={[12, 24]}
    >
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>Бараа материал / Бараа материалын жагсаалт</Title>
        </Space>
      </Col>
      <Col md={24} lg={8} xl={5}>
        <NewSearch />
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyOnHidden={true} />
      </Col>
    </Row>
  );
};
export default page;
