"use client";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { SaveIncome } from "./save-income";
import { DocumentList } from "../document-list";
import { TransactionList } from "../transaction-list";
const { Title } = Typography;
const TransactionIncomePage = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Орлого бүртгэх
        </div>
      ),
      key: "item-1",
      children: <SaveIncome />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
      children: <DocumentList />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: <TransactionList />,
    },
  ];
  return (
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>
            Бараа материал /Орлогын гүйлгээ/Бараа материалын орлого
          </Title>
        </Space>
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default TransactionIncomePage;
