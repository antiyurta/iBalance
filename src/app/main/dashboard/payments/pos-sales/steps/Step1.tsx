import { Button, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Membership from "./Step1/Membership";
import Bonus from "./Step1/Bonus";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import {
  setIsMembership,
  setIsSaveAndSetSaveValue,
  setIsUseSaveAndSetUseValue,
} from "@/feature/core/reducer/PosReducer";

const { Title } = Typography;

interface IProps {
  data: {
    amount: number;
    bonus: number;
  };
  isPrev?: () => void;
  isNext?: () => void;
  paidAmount: (value: number) => void;
}

const Step1 = (props: IProps) => {
  const dispatch = useDispatch();
  const { data, isNext, paidAmount } = props;
  const { isMembership, isSave, saveValue, isUseSave, useValue } =
    useTypedSelector((state: RootState) => state.posStep);
  const [isBonus, setIsBonus] = useState<boolean>(false);
  //
  const setPosMembership = (state: boolean) => {
    dispatch(setIsMembership(state));
  };
  //
  useEffect(() => {
    if (!isMembership) {
      dispatch(
        setIsSaveAndSetSaveValue({
          isSave: true,
          saveValue: 0,
        })
      );
      dispatch(
        setIsUseSaveAndSetUseValue({
          isUseSave: false,
          useValue: 0,
        })
      );
    }
  }, [isMembership]);
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
          <Switch checked={isMembership} onChange={setPosMembership} />
        </div>
        {isMembership ? <Membership amount={data.amount} /> : null}
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
                value={data.amount}
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                displayType="text"
                suffix="₮"
              />
            </Title>
          </div>
          {isUseSave ? (
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
          ) : null}
          {!isSave ? (
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
          ) : null}
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
              value={
                isUseSave ? data.amount - useValue : data.amount - saveValue
              }
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
              paidAmount(
                isUseSave ? data.amount - useValue : data.amount - saveValue
              );
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
