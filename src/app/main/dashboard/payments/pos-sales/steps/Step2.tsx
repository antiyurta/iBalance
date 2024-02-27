import { NewInputNumber } from "@/components/input";
import { IDataReferencePaymentMethod } from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import PayRequests from "./Step2/payRequests";
import { openNofi } from "@/feature/common";
import { IDataPaymentInvoice } from "@/service/pos/invoice/entities";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { useTypedSelector } from "@/feature/store/reducer";
import {
  onPaid,
  prevStep,
  stepPayment,
} from "@/feature/store/slice/point-of-sale/shopping-cart.slice";

const { Title } = Typography;

const Step2: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const goods = useTypedSelector((state) => state.shoppingGoods);
  const { invoices } = useTypedSelector((state) => state.shoppingCart);
  const [formMessage, setFormMessage] = useState<string>("");
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [activeKey, setActiveKey] = useState<number>();
  const [paymentMethods, setPaymentMethods] =
    useState<IDataReferencePaymentMethod[]>();
  const [isInvoiceReload, setIsInvoiceReload] = useState<boolean>(false);
  const [amountDiff, setAmountDiff] = useState<number>(2000);
  const totalAmount = goods.reduce((total, item) => total + item.payAmount, 0);
  const getPaymentMethods = async () => {
    blockContext.block();
    await ReferencePaymentMethodService.get({})
      .then((response) => {
        setPaymentMethods(response.response);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const setRequest = async (values: { amount: number }) => {
    if (!activeKey) {
      openNofi("error", "Төлбөрийн хэлбэр сонгоно уу");
    } else {
      form.resetFields();
      const method = paymentMethods?.find((method) => method.id === activeKey);
      if (method) {
        dispatch(onPaid({ payMethodId: method.id, payAmount: values.amount }));
        setActiveKey(undefined);
      }
    }
  };
  useEffect(() => {
    getPaymentMethods();
  }, []);
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
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Title level={2}>Төлөх дүн:</Title>
        <Title
          style={{
            margin: 0,
            color: "green",
          }}
          level={1}
        >
          <NumericFormat
            value={totalAmount}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            displayType="text"
            suffix="₮"
          />
        </Title>
      </div>
      <div className="step-payment">
        <div className="payment-types">
          {paymentMethods
            ?.filter((method) => method.isActive)
            .map((method, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    form.resetFields();
                    dispatch(onPaid({ payMethodId: method.id, payAmount: 0 }));
                    setActiveKey(method.id);
                    setFormMessage(method.name || "");
                  }}
                  className={
                    invoices
                      .filter((item) => item.payAmount > 0)
                      .map((item) => item.payMethodId)
                      .includes(method.id)
                      ? "payment-type-box-disabled"
                      : activeKey === method.id
                      ? "payment-type-box-active"
                      : "payment-type-box"
                  }
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${method.logo}`}
                    width={24}
                    height={24}
                    alt={method.name || ""}
                  />
                  <Title
                    level={4}
                    style={{
                      fontWeight: 700,
                      color: "#86909C",
                    }}
                  >
                    {method.name}
                  </Title>
                </div>
              );
            })}
        </div>
        {activeKey ? (
          <Form form={form}>
            <Space.Compact>
              <Form.Item
                label={<Title level={2}>{formMessage}</Title>}
                name={"amount"}
                rules={[
                  {
                    required: true,
                    message: `${formMessage} Үнийн дүн оруулна уу`,
                  },
                ]}
              >
                <NewInputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/(,*)/g, "")}
                  // max={amountDiff}
                  step="0.1"
                  // onDoubleClick={() => {
                  //   form.setFieldValue("amount", amountDiff);
                  // }}
                />
              </Form.Item>
              <Button
                style={{
                  height: 36,
                }}
                onClick={() => {
                  form.validateFields().then(setRequest);
                }}
                icon={<RightOutlined />}
              />
            </Space.Compact>
          </Form>
        ) : null}
        <PayRequests
          invoices={[]}
          isReload={() => setIsInvoiceReload(!isInvoiceReload)}
          amountDiff={amountDiff}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Button
            title="Буцах"
            // disabled={methods?.length ? true : false}
            onClick={() => dispatch(prevStep())}
            icon={<LeftOutlined />}
          />
          <Button
            onClick={() => dispatch(stepPayment())}
            type="primary"
            style={{
              width: "100%",
            }}
            // disabled={amountDiff <= 0 ? false : true}
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Step2;
