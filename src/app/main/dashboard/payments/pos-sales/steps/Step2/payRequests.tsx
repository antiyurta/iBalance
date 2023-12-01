import Image from "next/image";
import { Typography } from "antd";
import { NumericFormat } from "react-number-format";
import { IDataPaymentInvoice } from "@/service/pos/invoice/entities";
import { PosInvoiceService } from "@/service/pos/invoice/service";

const { Title } = Typography;

interface IProps {
  isReload: () => void;
  invoices: IDataPaymentInvoice[];
  amountDiff: number;
}

const PayRequests = (props: IProps) => {
  const { invoices, isReload, amountDiff } = props;
  const remove = (id: string) => {
    PosInvoiceService.remove(id).then((response) => {
      if (response.success) {
        isReload();
      }
    });
  };
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
                alignSelf: "end",
                alignItems: "flex-end",
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${invoice.paymentMethodLogo}`}
                width={18}
                height={18}
                alt={invoice.paymentMethodName}
              />
              <Title level={3}>{invoice.paymentMethodName}</Title>
              <Title
                level={3}
                style={{
                  margin: 0,
                }}
              >
                <NumericFormat
                  value={invoice.amount}
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Title>

              <button
                // disabled={method.type === PaymentType.Cash ? false : true}
                onClick={() => remove(invoice.id)}
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
            color: Math.sign(amountDiff) != -1 ? "black" : "red",
          }}
        >
          {Math.sign(amountDiff) != -1 ? "Үлдэгдэл:" : "Хариулт:"}
        </Title>
        <Title
          level={3}
          style={{
            color: Math.sign(amountDiff) != -1 ? "black" : "red",
          }}
        >
          <NumericFormat
            value={amountDiff}
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
