import { ComponentType } from "@/service/entities";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
import SavePrice from "./save-price";
import CommandList from "./command-list";
import PriceList from "./price-list";
import { MaterialType } from "@/service/material/entities";
import { CommandType } from "@/service/command/entities";

interface IProps {
  ComponentType: ComponentType;
  name: string;
  type: CommandType;
}

const { Title } = Typography;

const Price = (props: IProps) => {
  const { ComponentType, name, type } = props;
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
      children: <PriceList type={type} />,
    },
  ];
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>Үндсэн бүртгэл / Төлбөр, үнэ / {name}</Title>
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
