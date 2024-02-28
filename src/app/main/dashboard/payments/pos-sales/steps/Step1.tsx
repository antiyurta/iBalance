import { Button, Switch, Typography } from "antd";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import Membership from "./Step1/Membership";
import Bonus from "./Step1/Bonus";
import { useTypedSelector } from "@/feature/store/reducer";
import { stepDiscount } from "@/feature/store/slice/point-of-sale/shopping-cart.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { usePaymentContext } from "@/feature/context/PaymentGroupContext";

const { Title } = Typography;
const Step1: React.FC = () => {
  const [isMembership, setIsMembership] = useState<boolean>(false);
  const [isBonus, setIsBonus] = useState<boolean>(false);
  const { payAmount } = usePaymentContext();
  const dispatch = useDispatch<AppDispatch>();
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
        {isMembership && <Membership />}
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
        {isBonus && <Bonus />}
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
                value={payAmount}
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                displayType="text"
                suffix="₮"
              />
            </Title>
          </div>
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
              value={payAmount}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              suffix="₮"
            />
          </Title>
          <Button
            type="primary"
            onClick={() =>
              dispatch(
                stepDiscount({
                  membershipId: 0,
                  useMembershipPoint: 0,
                  useGiftPoint: 0,
                })
              )
            }
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Step1;
