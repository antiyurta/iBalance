import React from "react";
import { ComponentType } from "@/service/entities";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
import SavePrice from "./save-price";
import CommandList from "./command-list";
import PriceList from "./price-list";
import { CommandType } from "@/service/command/entities";
import DiscountList from "./discount/discount-list";
import CouponList from "./coupon/coupon-list";
import PageTitle from "@/components/page-title";

interface IProps {
  ComponentType: ComponentType;
  name: string;
  type: CommandType;
}

const { Title } = Typography;

const Price = (props: IProps) => {
  const { ComponentType, name, type } = props;
  const getDetailList = (): React.ReactNode => {
    if (type == CommandType.Discount) {
      return <DiscountList />;
    } else if (type == CommandType.Coupon) {
      return <CouponList />;
    } else {
      return <PriceList type={type} />;
    }
  };
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Төлбөр, үнэ
        </div>
      ),
      key: "item-1",
      children: <SavePrice type={type} />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
      children: <CommandList type={type} />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
      children: getDetailList(),
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
export default Price;
