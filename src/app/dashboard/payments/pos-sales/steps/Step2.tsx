import { NewInput } from "@/components/input";
import {
  CreditCardOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Button, Space, Typography } from "antd";

const { Title } = Typography;

interface IProps {
  isPrev?: () => void;
  isNext?: () => void;
}

const Step2 = (props: IProps) => {
  const { isPrev, isNext } = props;
  return (
    <div className="step-payment">
      <div className="payment-types">
        <div className="payment-type-box">
          <CreditCardOutlined
            style={{
              color: "#86909C",
              fontSize: 24,
            }}
          />
          <Title
            level={4}
            style={{
              fontWeight: 700,
              color: "#86909C",
            }}
          >
            Бэлэн мөнгө
          </Title>
        </div>
        <div className="payment-type-box">
          <CreditCardOutlined
            style={{
              color: "#86909C",
              fontSize: 24,
            }}
          />
          <Title
            level={4}
            style={{
              fontWeight: 700,
              color: "#86909C",
            }}
          >
            Бэлэн мөнгө
          </Title>
        </div>
        <div className="payment-type-box">
          <CreditCardOutlined
            style={{
              color: "#86909C",
              fontSize: 24,
            }}
          />
          <Title
            level={4}
            style={{
              fontWeight: 700,
              color: "#86909C",
            }}
          >
            Бэлэн мөнгө
          </Title>
        </div>
      </div>
      <Space.Compact>
        <NewInput />
        <Button icon={<RightOutlined />} />
      </Space.Compact>
      <div className="payment-info">
        <Title
          level={3}
          style={{
            fontWeight: 400,
          }}
        >
          Үлдэгдэл:
        </Title>
        <Title level={3}>57,000.00₮</Title>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <Button onClick={isPrev} icon={<LeftOutlined />} />
        <Button
          onClick={isNext}
          type="primary"
          style={{
            width: "100%",
          }}
        >
          Үргэлжлүүлэх
        </Button>
      </div>
    </div>
  );
};
export default Step2;
