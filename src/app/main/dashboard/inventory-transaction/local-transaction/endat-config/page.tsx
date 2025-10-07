"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
// import TransactionMove from "./transaction-move";
import { DocumentList } from "../../document-list";
import { TransactionList } from "../../transaction-list";
import { MovingStatus } from "@/service/document/entities";
import TransactionEndatConfig from "./transaction-endat-config";

const { Title } = Typography;

const TransactionCensusPage = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Гүйлгээ бүртгэх
        </div>
      ),
      key: "item-1",
      children: <TransactionEndatConfig />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
      children: <DocumentList movingStatus={MovingStatus.ItemConversion} />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: <TransactionList movingStatus={MovingStatus.ItemConversion} />,
    },
  ];
  return (
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>Бараа материал / Бусад гүйлгээ / Хөрвүүлэг</Title>
        </Space>
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyOnHidden={true} />
      </Col>
    </Row>
  );
};
export default TransactionCensusPage;
