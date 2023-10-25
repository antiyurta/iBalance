import { ComponentType } from "@/service/entities";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
import SavePrice from "./save-price";
import CommandList from "./command-list";
import PriceList from "./price-list";
import { CommandType } from "@/service/command/entities";
import DiscountList from "./discount/discount-list";
import CouponList from "./coupon/coupon-list";

interface IProps {
  ComponentType: ComponentType;
  name: string;
  type: CommandType;
}

const { Title } = Typography;

const Price = (props: IProps) => {
  const { ComponentType, name, type } = props;
  const getDetailList = (): JSX.Element => {
    if (type == CommandType.Discount) {
      return <DiscountList type={type} />;
    } else if (type == CommandType.Coupon) {
      return <CouponList type={type} />;
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
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={3}>Үндсэн бүртгэл / Төлбөр, үнэ / {name}</Title>
              </Space>
            </Col>
            <Col md={24} lg={8} xl={5}>
              <Input.Search />
            </Col>
          </>
        ) : null}
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
export default Price;
