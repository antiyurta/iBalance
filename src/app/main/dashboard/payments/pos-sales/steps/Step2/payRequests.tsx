import Image from "next/image";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { removeMethod } from "@/feature/core/reducer/PosReducer";

const { Title } = Typography;

interface IProps {
  paidAmount: number;
  amountDiff: (value: number) => void;
}

const PayRequests = (props: IProps) => {
  const dispatch = useDispatch();
  const { paidAmount, amountDiff } = props;
  const [balance, setBalance] = useState<number>(paidAmount);
  const { methods } = useTypedSelector((state: RootState) => state.posStep);
  const remove = (id: number) => {
    dispatch(removeMethod(id));
  };
  useEffect(() => {
    if (methods) {
      const resultTotal: number = methods?.reduce(
        (total: number, method) => (total += method.amount),
        0
      );
      setBalance(paidAmount - resultTotal);
      amountDiff(balance);
    }
  }, [methods]);
  useEffect(() => {
    amountDiff(balance);
  }, [balance]);
  return (
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
          flexDirection: "column",
          gap: 12,
          alignSelf: "flex-end",
        }}
      >
        {methods?.map((method, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                alignSelf: "end",
                alignItems: "flex-end",
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${method.imageUrl}`}
                width={18}
                height={18}
                alt={method.name}
              />
              <Title level={3}>{method.name}</Title>
              <Title
                level={3}
                style={{
                  margin: 0,
                }}
              >
                <NumericFormat
                  value={method.amount}
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Title>

              <button
                // disabled={method.type === PaymentType.Cash ? false : true}
                onClick={() => remove(method.id)}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
      <div className="payment-info">
        <Title
          level={3}
          style={{
            fontWeight: 400,
            color: Math.sign(balance) != -1 ? "black" : "red",
          }}
        >
          {Math.sign(balance) != -1 ? "Үлдэгдэл:" : "Хариулт:"}
        </Title>
        <Title
          level={3}
          style={{
            color: Math.sign(balance) != -1 ? "black" : "red",
          }}
        >
          <NumericFormat
            value={balance}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            displayType="text"
            suffix="₮"
          />
        </Title>
      </div>
    </div>
  );
};
export default PayRequests;
