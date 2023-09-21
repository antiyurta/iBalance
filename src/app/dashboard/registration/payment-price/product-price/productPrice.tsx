import { ComponentType } from "@/service/entities";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
import AddPage from "./addPage";

interface IProps {
  ComponentType: ComponentType;
}

const { Title } = Typography;

const ProductPrice = (props: IProps) => {
  const { ComponentType } = props;
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined />
          Төлбөр, үнэ
        </div>
      ),
      key: "item-1",
      children: <AddPage />,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-2",
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-3",
    },
  ];
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>
                  Үндсэн бүртгэл / Төлбөр, үнэ / Үндсэн үнэ
                </Title>
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
export default ProductPrice;
