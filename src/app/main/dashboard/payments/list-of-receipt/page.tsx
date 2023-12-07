"use client";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
import React from "react";
/** Төлбөрийн жагсаалт*/
import Jurnal from "./Jurnal";
/** Буцаалтын жагсаалт */
import ReturnList from "./ReturnList";
/** Төлбөр төлөлтийн жагсаалт */
import ListOfPayments from "./ListOfPayments";
/** Гишүүнчлэлийн картын гүйлгээний жагсаалт */
import ListOfMembershipCardTransactions from "./ListOfMembershipCardTransactions";
/** Бэлгийн картын гүйлгээний жагсаалт */
import ListOfGiftCard from "./ListOfGiftCard";
/** Өдрийн нээлт, хаалтын түүх */
import OpeningClosingHistory from "./OpeningClosingHistory";
const { Title } = Typography;
const ListOfReceipt = () => {
  const items = [
    {
      label: "Төлбөрийн жагсаалт",
      key: "item-1",
      children: <Jurnal />,
    },
    {
      label: "Буцаалтын жагсаалт",
      key: "item-2",
      children: <ReturnList />,
    },
    {
      label: "Гишүүнчлэлийн картын гүйлгээний жагсаалт",
      key: "item-3",
      children: <ListOfMembershipCardTransactions />,
    },
    {
      label: "Бэлгийн картын гүйлгээний жагсаалт",
      key: "item-4",
      children: <ListOfGiftCard />,
    },
    {
      label: "Өдрийн нээлт, хаалтын түүх",
      key: "item-5",
      children: <OpeningClosingHistory />,
    },
  ];
  return (
    <div>
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={2}>Төлбөр тооцоо / Баримтын жагсаалт</Title>
          </Space>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <Input.Search />
        </Col>
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
    </div>
  );
};
export default ListOfReceipt;
