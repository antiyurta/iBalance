import Image from "next/image";
import { Button, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { NumericFormat } from "react-number-format";
import { removePaid } from "@/feature/store/slice/point-of-sale/shopping-cart.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { useTypedSelector } from "@/feature/store/reducer";
import React from "react";
import { usePaymentContext } from "@/feature/context/PaymentGroupContext";

const { Title } = Typography;

const PayRequests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices } = useTypedSelector((state) => state.shoppingCart);
  const { payAmount, paidAmount } = usePaymentContext();
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
        {invoices?.map((invoice, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
              }}
            >
              <Image
                src={invoice.logo}
                width={18}
                height={18}
                alt={invoice.methodName}
              />
              <Title level={3}>{invoice.methodName}</Title>
              <Title
                level={3}
                style={{
                  margin: 0,
                }}
              >
                <NumericFormat
                  value={invoice.incomeAmount}
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Title>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => dispatch(removePaid(invoice))}
              />
            </div>
          );
        })}
      </div>
      <div className="payment-info">
        <Title
          level={3}
          style={{
            fontWeight: 400,
            color: Math.sign(payAmount) != -1 ? "black" : "red",
          }}
        >
          {Math.sign(payAmount - paidAmount) != -1 ? "Үлдэгдэл:" : "Хариулт:"}
        </Title>
        <Title
          level={3}
          style={{
            color: Math.sign(payAmount - paidAmount) != -1 ? "black" : "red",
          }}
        >
          <NumericFormat
            value={payAmount - paidAmount}
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
