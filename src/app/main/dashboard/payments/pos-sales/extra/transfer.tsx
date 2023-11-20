import { Button, Form, Typography } from "antd";
import { useEffect, useState } from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import NewModal from "@/components/modal";
import { LeftOutlined } from "@ant-design/icons";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import TransferModal from "./transferTable";
import { PaymentType } from "@/service/reference/payment-method/entities";

const { Title } = Typography;

enum Type {
  ADD = "ADD",
  REMOVE = "REMOVE",
  TRANSFER = "TRANSFER",
}

interface IData {
  paymentType: PaymentType;
  type: Type;
  employeeId?: number;
  amount: number;
  description: string;
}

const rules = [
  {
    required: true,
    message: "Заавал",
  },
];

const Transfer = () => {
  const [form] = Form.useForm();
  const TransactionType = Form.useWatch("type", form);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenBadgeModal, setIsOpenBadgeModal] = useState<boolean>(false);
  const onFinish = (values: IData) => {
    console.log({
      ...values,
      amount: parseFloat(values.amount.toFixed(2)),
    });
  };
  useEffect(() => {
    isOpenModal && form.resetFields();
  }, [isOpenModal]);
  return (
    <>
      <div
        onClick={() => {
          setIsOpenModal(true);
        }}
        className="payment-type-box-gray"
      >
        <CreditCardOutlined
          style={{
            color: "#86909C",
            fontSize: 24,
          }}
        />
        <Title
          level={4}
          style={{
            fontWeight: 700,
            color: "#86909C",
            textAlign: "center",
          }}
        >
          Мөнгө нэмэх, хасах, шилжүүлэг
        </Title>
      </div>
      <NewModal
        title=" "
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        width={300}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingTop: 12,
        }}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>Мөнгө нэмэх, хасах, шилжүүлэх</Title>
          <TransferModal />
        </div>
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Form.Item label="Бэлэн/Бэлэн бусын хэлбэр" name="paymentType">
              <NewSelect
                options={[
                  {
                    label: "Бэлэн",
                    value: PaymentType.Cash,
                  },
                  {
                    label: "Бэлэн бус",
                    value: PaymentType.NotCash,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Нэмэх/Хасах/Шилжүүлэг" name="type">
              <NewSelect
                options={[
                  {
                    label: "Нэмэх",
                    value: Type.ADD,
                  },
                  {
                    label: "Хасах",
                    value: Type.REMOVE,
                  },
                  {
                    label: "Шилжүүлэг",
                    value: Type.TRANSFER,
                  },
                ]}
              />
            </Form.Item>
            {TransactionType === Type.TRANSFER ? (
              <Form.Item label="Шилжүүлэх кассчны нэр" name="employeeId">
                <NewSelect
                  options={[
                    {
                      label: "test",
                      value: 0,
                    },
                  ]}
                />
              </Form.Item>
            ) : null}
            <Form.Item label="Дүн" name="amount" rules={rules}>
              <NewInputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item label="Гүйлгээний утга" name="description">
              <NewInput />
            </Form.Item>
          </div>
        </Form>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Button
            icon={<LeftOutlined />}
            onClick={() => setIsOpenModal(false)}
          />
          <Button
            onClick={() => {
              form.validateFields().then((values) => {
                onFinish(values);
              });
            }}
            type="primary"
            style={{
              width: "100%",
            }}
          >
            Хадгалах
          </Button>
        </div>
      </NewModal>
      <NewModal
        title=" "
        open={isOpenBadgeModal}
        onCancel={() => setIsOpenBadgeModal(false)}
      ></NewModal>
    </>
  );
};
export default Transfer;
