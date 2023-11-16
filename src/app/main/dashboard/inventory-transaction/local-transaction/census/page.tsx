"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
// import TransactionMove from "./transaction-move";
import { DocumentList } from "../../document-list";
import { MovingStatus } from "@/service/document/entities";
import TransactionCencus from "./TransactionCencus";

const { Title } = Typography;

const TransactionCensusPage = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Тооллого бүртгэх
        </div>
      ),
      key: "item-1",
      children: <TransactionCencus />,
    },
    {
      label: "Тооллогын жагсаалт",
      key: "item-2",
      children: <DocumentList movingStatus={MovingStatus.Cencus} />,
    },
  ];
  return (
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>
            Бараа материал / Бусад гүйлгээ / Тооллого
          </Title>
        </Space>
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default TransactionCensusPage;
