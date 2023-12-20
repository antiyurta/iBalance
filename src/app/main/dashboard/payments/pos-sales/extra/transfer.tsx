import { Button, Form, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import NewModal from "@/components/modal";
import { LeftOutlined } from "@ant-design/icons";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import TransferModal from "./transferTable";
import { PaymentType } from "@/service/reference/payment-method/entities";
import { IDataMoneyTransaction } from "@/service/pos/money-transaction/entities";
import { IDataPos, IParamPos } from "@/service/pos/entities";
import { PosService } from "@/service/pos/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MoneyTransactionService } from "@/service/pos/money-transaction/service";
import { RootState, useTypedSelector } from "@/feature/store/reducer";

const { Title } = Typography;

enum Type {
  ADD = "ADD",
  REMOVE = "REMOVE",
  TRANSFER = "TRANSFER",
}
interface PosTransfer {
  toPosId: number;
  type: PaymentType;
  transactionType: Type;
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
  const [form] = Form.useForm<PosTransfer>();
  const blockContext: BlockView = useContext(BlockContext);
  const { posOpenClose } = useTypedSelector((state: RootState) => state);
  const TransactionType = Form.useWatch("transactionType", form);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenBadgeModal, setIsOpenBadgeModal] = useState<boolean>(false);
  const [poses, setPoses] = useState<IDataPos[]>([]);

  const onFinish = async (values: PosTransfer) => {
    blockContext.block();
    const data: IDataMoneyTransaction = {
      posId: posOpenClose.posId,
      toPosId: values.toPosId,
      type: values.type,
      isTransaction: values.transactionType == Type.TRANSFER,
      description: values.description,
      increaseAmount: values.transactionType == Type.ADD ? values.amount : 0,
      decreaseAmount:
        values.transactionType == Type.REMOVE ||
        values.transactionType == Type.TRANSFER
          ? values.amount
          : 0,
    };
    await MoneyTransactionService.post(data)
      .then((response) => {
        if (response.success) {
          setIsOpenModal(false);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const getPoses = async (params: IParamPos) => {
    blockContext.block();
    await PosService.get(params)
      .then((response) => {
        if (response.success) {
          setPoses(response.response.data);
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    isOpenModal && form.resetFields();
    getPoses({ isAuth: false });
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
            <Form.Item label="Бэлэн/Бэлэн бусын хэлбэр" name="type">
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
            <Form.Item label="Нэмэх/Хасах/Шилжүүлэг" name="transactionType">
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
              <Form.Item label="Шилжүүлэх кассчны нэр" name="toPosId">
                <NewSelect
                  options={poses.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
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
