"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { NewSearch } from "@/components/input";

//
import CreateOrder from "./createOrder";
import Distribution from "./distribution";

const { Title } = Typography;

export enum TabType {
  CREATE_ORDER = "create_order",
  DISTRIBUTION = "distribution",
}

const page = () => {
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
    <Row
      style={{
        paddingTop: 16,
      }}
      gutter={[12, 24]}
    >
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>Захиалга, хуваарилалт / Борлуулалт</Title>
        </Space>
      </Col>
      <Col md={24} lg={8} xl={5}>
        <NewSearch />
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default page;
