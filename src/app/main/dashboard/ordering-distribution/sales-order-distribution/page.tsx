"use client";
import { Col, Row, Tabs } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateOrder from "./createOrder";
import Distribution from "./distribution";
import { TabType } from "@/service/order-distribution/entities";
import PageTitle from "@/components/page-title";

const SalePage = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined /> Захиалга үүсгэх
        </div>
      ),
      key: "item-1",
      children: (
        <CreateOrder
          type={TabType.CREATE_ORDER}
          isEdit={false}
          isFormAdd={true}
        />
      ),
    },
    {
      label: "Хуваарилалт хийх",
      key: "item-2",
      children: <Distribution />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-3",
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-4",
    },
  ];
  return (
    <>
      <PageTitle />
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
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
export default SalePage;
