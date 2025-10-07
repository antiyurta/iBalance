"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { DocumentList } from "../../document-list";
import { TransactionList } from "../../transaction-list";
import { MovingStatus } from "@/service/document/entities";
import TransactionMixture from "./transaction-mixture";
import PageTitle from "@/components/page-title";

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
      children: <TransactionMixture />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
      children: <DocumentList movingStatus={MovingStatus.Mixture} />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: <TransactionList movingStatus={MovingStatus.Mixture} />,
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
