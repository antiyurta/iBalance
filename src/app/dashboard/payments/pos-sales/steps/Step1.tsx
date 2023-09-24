import { NewInput, NewSelect } from "@/components/input";
import { Button, Typography } from "antd";

const { Title } = Typography;

interface IProps {
  isPrev?: () => void;
  isNext?: () => void;
}

const Step1 = (props: IProps) => {
  const { isNext } = props;
  return (
    <div className="step-membership">
      <NewInput placeholder="Утас / Эсвэл РД хайх" />
      <div className="info">
        <div className="names">
          <Title level={3} type="secondary">
            Овог: Мөнхтөр
          </Title>
          <Title level={3} type="secondary">
            Овог: Мөнхтөр
          </Title>
        </div>
        <div className="card-no">
          <Title level={3} type="secondary">
            Картын дугаар:
          </Title>
          <NewSelect
            style={{
              width: 200,
            }}
            options={[
              {
                label: "1236456789000",
                value: 1,
              },
            ]}
          />
        </div>
        <div className="card-info">
          <Title level={3} type="secondary">
            Картын нэр: Мөнгөн
          </Title>
          <Title
            level={3}
            style={{
              color: "#E35D6A",
            }}
            type="secondary"
          >
            Нэмэгдсэн оноо: 1,100.00₮
          </Title>
        </div>
      </div>
      <Title
        style={{
          fontSize: 20,
          fontWeight: 400,
          alignSelf: "center",
        }}
      >
        Онооны үлдэгдэл: 11,000.00 ₮
      </Title>
      <div className="inputs">
        <button
          className="app-button-regular"
          style={{
            height: 36,
            minWidth: 140,
          }}
        >
          Оноо ашиглах
        </button>
        <NewInput type="password" placeholder="Пин код оруулах" />
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          background: "#ccc",
        }}
      />
      <Title
        style={{
          fontSize: 20,
          fontWeight: 500,
        }}
      >
        Бэлгийн карттай эсэх:
      </Title>
      <NewInput />
      <div
        style={{
          width: "100%",
          height: 1,
          background: "#ccc",
        }}
      />
      <div className="numbers">
        <Title
          style={{
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          Нийт дүн:
        </Title>
        <Title
          style={{
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          88,000.00 ₮
        </Title>
      </div>
      <div className="numbers">
        <Title
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#DC3545",
          }}
        >
          Ашигласан оноо:
        </Title>
        <Title
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#DC3545",
          }}
        >
          11,000.00 ₮
        </Title>
      </div>
      <div className="numbers">
        <Title
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#DC3545",
          }}
        >
          Харилцагчийн хөнгөлөлт:
        </Title>
        <Title
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#DC3545",
          }}
        >
          0.00 ₮
        </Title>
      </div>
      <div className="numbers">
        <Title
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#DC3545",
          }}
        >
          Бэлгийн карт/1 удаагийн ХА-лтын/:
        </Title>
        <Title
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#DC3545",
          }}
        >
          0.00 ₮
        </Title>
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          background: "#ccc",
        }}
      />
      <Title
        style={{
          fontSize: 20,
          fontWeight: 400,
          alignSelf: "center",
        }}
      >
        Төлөх дүн: 77,000.00 ₮
      </Title>
      <Button type="primary" onClick={() => isNext?.()}>
        Үргэлжлүүлэх
      </Button>
    </div>
  );
};
export default Step1;
