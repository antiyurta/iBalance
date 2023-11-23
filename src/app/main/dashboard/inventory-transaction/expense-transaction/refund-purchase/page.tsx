"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { DocumentList } from "../../document-list";
import { TransactionList } from "../../transaction-list";
import { MovingStatus } from "@/service/document/entities";
import TransactionRefundPurchase from "./transaction-refund-purchase";

const { Title } = Typography;

const TransactionRefundPurchasePage = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Зарлага бүртгэх
        </div>
      ),
      key: "item-1",
      children: <TransactionRefundPurchase />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
      children: <DocumentList movingStatus={MovingStatus.PurchaseReturn} />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: <TransactionList movingStatus={MovingStatus.PurchaseReturn} />,
    },
  ];
  return (
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>
            Бараа материал / Зарлагын гүйлгээ/ Худалдан авалтын буцаалт
          </Title>
        </Space>
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default TransactionRefundPurchasePage;
