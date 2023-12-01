import { Button, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Membership from "./Step1/Membership";
import Bonus from "./Step1/Bonus";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
// import {
//   setIsMembership,
//   setIsSaveAndSetSaveValue,
//   setIsUseSaveAndSetUseValue,
// } from "@/feature/core/reducer/PosReducer";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";

const { Title } = Typography;

interface IProps {
  data: IDataShoppingCart;
  isPrev?: () => void;
  isNext?: () => void;
}

const Step1 = (props: IProps) => {
  const { data, isNext } = props;
  const [isMembership, setIsMembership] = useState<boolean>(false);
  const [isBonus, setIsBonus] = useState<boolean>(false);
  const getMembership = () => {
    setIsMembership(data.consumerMembershipId !== null);
  };
  useEffect(() => {
    getMembership()
  }, [data]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Title level={2}>Гишүүнчлэлтэй эсэх:</Title>
          <Switch checked={isMembership} onChange={setIsMembership} />
        </div>
        {isMembership ? <Membership data={data} /> : null}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#ccc",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Title level={2}>Бэлгийн карттай эсэх:</Title>
          <Switch onChange={setIsBonus} />
        </div>
        {isBonus ? <Bonus /> : null}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#ccc",
          }}
        />
        <div className="step-membership">
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
              <NumericFormat
                value={data.totalAmount}
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                displayType="text"
                suffix="₮"
              />
            </Title>
          </div>
          {/* {isUseSave ? (
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
                <NumericFormat
                  value={useValue}
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Title>
            </div>
          ) : null} */}
          {/* {!isSave ? (
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
                <NumericFormat
                  value={saveValue}
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Title>
            </div>
          ) : null} */}
          {isBonus ? (
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
          ) : null}
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
            Төлөх дүн:
            <NumericFormat
              value={data.payAmount}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              suffix="₮"
            />
          </Title>
          <Button
            type="primary"
            onClick={() => {
              // paidAmount(
              //   isUseSave ? data.totalAmount - useValue : data.totalAmount - saveValue
              // );
              isNext?.();
            }}
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Step1;
