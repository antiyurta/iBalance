"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import TransactionMove from "./transaction-move";
import { DocumentList } from "../../document-list";
import { TransactionList } from "../../transaction-list";
import { MovingStatus } from "@/service/document/entities";

const { Title } = Typography;

const TransactionMovePage = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Зарлага бүртгэх
        </div>
      ),
      key: "item-1",
      children: <TransactionMove />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
      children: <DocumentList movingStatus={MovingStatus.MovementInWarehouse} />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: <TransactionList movingStatus={MovingStatus.MovementInWarehouse} />,
    },
  ];
  return (
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>
            Бараа материал / Зарлагын гүйлгээ/ Байршлын хөдөлгөөн
          </Title>
        </Space>
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default TransactionMovePage;