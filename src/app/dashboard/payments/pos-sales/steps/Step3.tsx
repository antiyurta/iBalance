import { LeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useState } from "react";

interface IProps {
  isPrev?: () => void;
  isNext?: () => void;
}

const { Title } = Typography;

type TaxType = "PERSON" | "BUSINESS";

const Step3 = (props: IProps) => {
  const [isActiveTaxType, setIsActiveTaxType] = useState<TaxType>("PERSON");
  const { isPrev, isNext } = props;
  return (
    <div className="step-tax">
      <div className="tax-type">
        <button
          className={
            isActiveTaxType === "PERSON" ? "app-button" : "app-button-regular"
          }
          style={{
            height: 55,
            fontSize: 16,
            fontWeight: 500,
          }}
          onClick={() => setIsActiveTaxType("PERSON")}
        >
          Хувь хүнд
        </button>
        <button
          className={
            isActiveTaxType === "BUSINESS" ? "app-button" : "app-button-regular"
          }
          style={{
            height: 55,
            fontSize: 16,
            fontWeight: 500,
          }}
          onClick={() => setIsActiveTaxType("BUSINESS")}
        >
          Бизнэсийн үйл ажиллагаанд
        </button>
      </div>
      <div className="numbers">
        <Title level={3} type="secondary">
          Төлсөн дүн
        </Title>
        <Title level={3} type="secondary">
          77,000.00
        </Title>
      </div>
      <div className="numbers">
        <Title level={3} type="secondary">
          Ибаримт руу илгээх дүн:
        </Title>
        <Title level={3} type="secondary">
          77,000.00
        </Title>
      </div>
      <Title
        level={3}
        style={{
          alignSelf: "center",
        }}
      >
        НӨАТ: 7,900.00
      </Title>
      <Title
        level={3}
        style={{
          alignSelf: "center",
        }}
      >
        НХАТ: 7,900.00
      </Title>
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
          type="primary"
          style={{
            width: "100%",
          }}
          icon={<PrinterOutlined />}
        >
          Баримт хэвлэх
        </Button>
      </div>
    </div>
  );
};
export default Step3;
