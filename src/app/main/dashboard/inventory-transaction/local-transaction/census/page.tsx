"use client";
import { Col, Row, Tabs } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { DocumentList } from "../../document-list";
import { MovingStatus } from "@/service/document/entities";
import TransactionCencus from "./transaction-cencus";
import { TransactionList } from "../../transaction-list";
import PageTitle from "@/components/page-title";

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
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: <TransactionList movingStatus={MovingStatus.Cencus} />,
    },
  ];
  return (
    <>
      <PageTitle />
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col span={24}>
          <Tabs className="lineTop" items={items} />
        </Col>
      </Row>
    </>
  );
};
export default TransactionCensusPage;
