"use client";
import { Col, Row, Tabs } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import TransactionMove from "./transaction-move";
import { MovingStatus } from "@/service/document/entities";
import PageTitle from "@/components/page-title";
import { DocumentList } from "../../document-list";
import { TransactionList } from "../../transaction-list";

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
      children: (
        <DocumentList movingStatus={MovingStatus.MovementInWarehouse} />
      ),
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: (
        <TransactionList movingStatus={MovingStatus.MovementInWarehouse} />
      ),
    },
  ];
  return (
    <>
      <PageTitle />
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
    </>
  );
};
export default TransactionMovePage;
