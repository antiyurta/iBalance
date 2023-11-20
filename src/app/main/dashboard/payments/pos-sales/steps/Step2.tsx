import { NewInputNumber } from "@/components/input";
import {
  IDataReferencePaymentMethod,
  PaymentType,
} from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import PayRequests from "./Step2/payRequests";
import { openNofi } from "@/feature/common";
import { useDispatch } from "react-redux";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { setMethods } from "@/feature/core/reducer/PosReducer";

const { Title } = Typography;

interface IProps {
  isPrev?: () => void;
  isNext?: () => void;
  paidAmount: number;
}

const Step2 = (props: IProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isPrev, isNext, paidAmount } = props;
  const [formMessage, setFormMessage] = useState<string>("");
  const { methods } = useTypedSelector((state: RootState) => state.posStep);
  const [amountDiff, setAmountDiff] = useState<number>(paidAmount);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [activeKey, setActiveKey] = useState<number>();
  const [paymentMethods, setPaymentMethods] =
    useState<IDataReferencePaymentMethod[]>();
  const getPaymentMethods = async () => {
    blockContext.block();
    await ReferencePaymentMethodService.get({})
      .then((response) => {
        setPaymentMethods(response.response.data);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const setRequest = (values: { amount: number }) => {
    if (!activeKey) {
      openNofi("error", "Төлбөрийн хэлбэр сонгоно уу");
    } else {
      form.resetFields();
      const method = paymentMethods?.find((method) => method.id === activeKey);
      if (method) {
        dispatch(
          setMethods({
            id: method.id,
            type: method.type,
            imageUrl: method.imageUrl,
            name: method.name,
            amount: parseFloat(values.amount.toFixed(2)),
          })
        );
        setActiveKey(undefined);
      }
    }
  };
  const isHaveReduxMethod = (id: number) => {
    if (methods?.find((method) => method.id === id)) {
      return true;
    }
    return false;
  };
  const checkMaxAmount = () => {
    if (
      !paymentMethods?.find(
        (method) => method.id === activeKey && method.type === PaymentType.Cash
      )
    ) {
      return amountDiff;
    }
    return 99999999;
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
            value={paidAmount}
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
                    if (!isHaveReduxMethod(method.id)) {
                      form.resetFields();
                      setActiveKey(method.id);
                      setFormMessage(method.name);
                    }
                  }}
                  className={
                    isHaveReduxMethod(method.id)
                      ? "payment-type-box-disabled"
                      : activeKey === method.id
                      ? "payment-type-box-active"
                      : "payment-type-box"
                  }
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${method.imageUrl}`}
                    width={24}
                    height={24}
                    alt={method.name}
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
            <Form.Item>
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
                    max={checkMaxAmount()}
                    step="0.1"
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
            </Form.Item>
          </Form>
        ) : null}
        <PayRequests
          paidAmount={paidAmount}
          amountDiff={(value) => setAmountDiff(value)}
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
            disabled={methods?.length ? true : false}
            onClick={isPrev}
            icon={<LeftOutlined />}
          />
          <Button
            onClick={isNext}
            type="primary"
            style={{
              width: "100%",
            }}
            disabled={amountDiff <= 0 ? false : true}
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Step2;
