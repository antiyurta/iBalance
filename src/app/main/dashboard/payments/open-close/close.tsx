import { NewDatePicker, NewInputNumber, NewSelect } from "@/components/input";
import { Button, Divider, Form, Table, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import {
  ICloseDto,
  IDataPosOpenClose,
} from "@/service/pos/open-close/entities";
import {
  CloseTable,
  StatisticDoc,
  closeNumber,
} from "../list-of-receipt/components/close-table";
import { useTypedSelector } from "@/feature/store/reducer";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import {
  IDataReferencePaymentMethod,
  PaymentType,
} from "@/service/reference/payment-method/entities";
import { MoneyTransactionService } from "@/service/pos/money-transaction/service";
import { MovingStatus } from "@/service/document/entities";
import dayjs from "dayjs";
import { PosInvoiceService } from "@/service/pos/invoice/service";
import { IDataPaymentInvoice } from "@/service/pos/invoice/entities";
import { IDataMoneyTransaction } from "@/service/pos/money-transaction/entities";
import { useWatch } from "antd/es/form/Form";

const { Title } = Typography;
interface IProps {
  openCloseId?: number;
  setIsClose: (value: boolean) => void;
}
const CloseState = (props: IProps) => {
  const { openCloseId, setIsClose } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<ICloseDto>();
  const [openClose, setOpenClose] = useState<IDataPosOpenClose>();
  const [cashDocuments, setCashDocuments] = useState<StatisticDoc[]>([]);
  const [isCashLoading, setIsCashLoading] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<IDataPaymentInvoice[]>([]);
  const [moneyTransactions, setMoneyTransactions] = useState<
    IDataMoneyTransaction[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    IDataReferencePaymentMethod[]
  >([]);
  const [membershipAmount, setMembershipAmount] = useState<number>(0);
  const [giftAmount, setGifAmount] = useState<number>(0);
  const [cashMoney, setCashMoney] = useState<number>(0);
  const [notcashMoney, setNotcashMoney] = useState<number>(0);
  const [lendMoney, setLendMoney] = useState<number>(0);
  const cashAmount = useWatch("cashAmount", form);
  const nonCashAmount = useWatch("nonCashAmount", form);
  const lendAmount = useWatch("lendAmount", form);
  const [cencusCashAmount, setCencusCashAmount] = useState<number>(0);
  const [cencusLendAmount, setCencusLendAmount] = useState<number>(0);

  const getOpenClose = async (id: number) => {
    blockContext.block();
    await OpenCloseService.getById(id)
      .then((response) => {
        if (response.success) {
          setOpenClose(response.response);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const getMoney = (type: PaymentType): number => {
    return invoices.reduce(
      (total, item) => (total + item.type == type ? Number(item.amount) : 0),
      0
    );
  };
  const getMoneyTransaction = (
    type: PaymentType
  ): { add: number; subtract: number } => {
    const add = moneyTransactions.reduce(
      (total, item) =>
        total + item.type == type ? Number(item.increaseAmount) : 0,
      0
    );
    const subtract = moneyTransactions.reduce(
      (total, item) =>
        total + item.type == type ? Number(item.decreaseAmount) : 0,
      0
    );
    return { add, subtract };
  };
  const getPayMethod = async () => {
    await ReferencePaymentMethodService.get({
      isActive: true,
      type: PaymentType.NotCash,
    }).then((response) => {
      if (response.success) {
        setPaymentMethods(response.response);
      }
    });
    await PosInvoiceService.get({ openCloseId, isPaid: true })
      .then((response) => {
        if (response.success) {
          setInvoices(response.response);
        }
      })
      .then(() => {
        setCashMoney(getMoney(PaymentType.Cash));
        setNotcashMoney(getMoney(PaymentType.NotCash));
        setLendMoney(getMoney(PaymentType.Lend));
      });
    await MoneyTransactionService.get({
      openCloseId,
      isTransaction: false,
    }).then((response) => {
      if (response.success) setMoneyTransactions(response.response.data);
    });
  };
  const getStatisticSale = (): StatisticDoc[] => {
    const totalSale: StatisticDoc = {
      state: "Нийт борлуулалт",
      qty: 0,
      amount: 0,
    };
    const refund: StatisticDoc = {
      state: "Буцаалт",
      qty: 0,
      amount: 0,
    };
    const materialDiscount: StatisticDoc = {
      state: "Бараа материалын хөнгөлөлт, урамшуулал",
      qty: 0,
      amount: 0
    };
    const consumerDiscount: StatisticDoc = {
      state: "Харилцагч, гишүүнчлэлийн хөнгөлөлт",
      qty: 0,
      amount: closeNumber({ value: membershipAmount + giftAmount }),
    };
    const realShoppingCarts = 0;
    const sale: StatisticDoc = {
      state: <div style={{ fontWeight: "bold" }}>Цэвэр борлуулалт</div>,
      qty: closeNumber({ value: 0, isBold: true }),
      amount: closeNumber({
        value: 0,
        isBold: true,
      }),
    };
    return [totalSale, refund, materialDiscount, consumerDiscount, sale];
  };
  const getStatisticCash = async () => {
    setIsCashLoading(true);
    const beginingMoney = openClose?.openerAmount || 0;
    const { add, subtract } = getMoneyTransaction(PaymentType.Cash);
    const realMoney = cashMoney + beginingMoney + add - subtract - 0;
    const totalCash: StatisticDoc = {
      state: "Нийт бэлэн борлуулалт",
      amount: closeNumber({ value: cashMoney }),
    };
    const beginingCash: StatisticDoc = {
      state: "Эхэлсэн мөнгө",
      amount: closeNumber({ value: beginingMoney }),
    };
    const addCash: StatisticDoc = {
      state: "Нэмсэн",
      amount: closeNumber({ value: add }),
    };
    const subtractCash: StatisticDoc = {
      state: "Хассан",
      amount: closeNumber({ value: subtract, isBracket: true }),
    };
    const refundCash: StatisticDoc = {
      state: "Буцаалт хасах",
      amount: closeNumber({ value: 0, isBracket: true }),
    };
    const realCash: StatisticDoc = {
      state: "Байх ёстой үлдэгдэл",
      amount: closeNumber({ value: realMoney }),
    };
    const cencusCash: StatisticDoc = {
      state: "Тоолсон",
      amount: closeNumber({ value: cashAmount }),
    };
    const cencusMoney = cashAmount - realMoney;
    const excessDeficiency: StatisticDoc = {
      state: (
        <>
          <div style={{ display: "flex" }}>
            Илүүдсэн <div style={{ color: "red" }}>(Дутсан)</div>
          </div>
        </>
      ),
      amount: closeNumber({
        value: cencusMoney,
        isBracket: cencusMoney < 0,
        isDanger: cencusMoney < 0,
      }),
    };
    setCashDocuments([
      totalCash,
      beginingCash,
      addCash,
      subtractCash,
      refundCash,
      realCash,
      cencusCash,
      excessDeficiency,
    ]);
    setIsCashLoading(false);
  };
  const getPay = (): StatisticDoc[] => {
    const cash: StatisticDoc = {
      state: "Бэлэн",
      amount: closeNumber({ value: cashMoney }),
    };
    const notCash: StatisticDoc = {
      state: "Бэлэн бус",
      amount: closeNumber({ value: notcashMoney }),
    };
    const lend: StatisticDoc = {
      state: "Зээл",
      amount: closeNumber({ value: lendMoney }),
    };
    const gift: StatisticDoc = {
      state: "Бэлгийн карт, эрхийн бичиг",
      amount: closeNumber({ value: giftAmount }),
    };
    const membership: StatisticDoc = {
      state: "Ашигласан оноогоор /гишүүнчлэл/",
      amount: closeNumber({ value: membershipAmount }),
    };
    const pre: StatisticDoc = {
      state: "Урьдчилгаа",
      amount: closeNumber({ value: 0 }),
    };
    const total: StatisticDoc = {
      state: "Нийт төлөлт",
      amount: closeNumber({
        value:
          cashMoney + notcashMoney + lendMoney + giftAmount + membershipAmount,
      }),
    };
    return [cash, notCash, lend, gift, membership, pre, total];
  };
  const getNotCash = (): StatisticDoc[] => {
    const { add, subtract } = getMoneyTransaction(PaymentType.NotCash);
    const notCashDoc: StatisticDoc[] = [];
    notCashDoc.push({
      state: "Нийт бэлэн бус борлуулалт",
      amount: closeNumber({ value: notcashMoney }),
    });
    for (const paymentMethod of paymentMethods) {
      const amount = invoices.reduce(
        (total, item) =>
          total + item.paymentMethodId == paymentMethod.id ? item.amount : 0,
        0
      );
      notCashDoc.push({
        state: (
          <ul>
            <li>{paymentMethod.name}</li>
          </ul>
        ),
        amount: closeNumber({ value: amount }),
      });
    }
    notCashDoc.push({
      state: "Нэмсэн",
      amount: closeNumber({ value: add }),
    });
    notCashDoc.push({
      state: "Хассан",
      amount: closeNumber({ value: subtract, isBracket: true }),
    });
    const realMoney = notcashMoney + add - subtract;
    notCashDoc.push({
      state: "Байх ёстой үлдэгдэл",
      amount: closeNumber({ value: realMoney }),
    });
    notCashDoc.push({
      state: "Settlements",
      amount: closeNumber({ value: nonCashAmount }),
    });
    return notCashDoc;
  };
  const getLend = (): StatisticDoc[] => {
    const cash: StatisticDoc = {
      state: "Нийт зээл борлуулалт",
      amount: closeNumber({ value: lendMoney }),
    };
    const notCash: StatisticDoc = {
      state: "Тооцоо нийлсэн",
      amount: lendAmount,
    };
    const cencusAmount = lendAmount - lendMoney;
    const lend: StatisticDoc = {
      state: (
        <>
          <div style={{ display: "flex" }}>
            Илүүдсэн <div style={{ color: "red" }}>(Дутсан)</div>
          </div>
        </>
      ),
      amount: closeNumber({
        value: cencusAmount,
        isBracket: cencusAmount < 0,
        isDanger: cencusAmount < 0,
      }),
    };
    return [cash, notCash, lend];
  };
  const onFinish = async (values: ICloseDto) => {
    if (openClose) {
      blockContext.block();
      await OpenCloseService.patchClose(openClose.id, values)
        .then((response) => {
          if (response.success) {
            setIsClose(true);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    openCloseId && getOpenClose(openCloseId);
    getStatisticCash();
    getPayMethod();
  }, []);
  useEffect(() => {
    getStatisticCash();
  }, [cashAmount]);
  useEffect(() => {
    getNotCash();
  }, [nonCashAmount]);
  useEffect(() => {
    getLend();
  }, [lendAmount]);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div className="open-close-close">
        <Title
          style={{
            fontSize: 20,
            fontWeight: 500,
            textAlign: "center",
            padding: 12,
          }}
        >
          Хаалт хийх
        </Title>
        <div className="close-body">
          <div className="close-content">
            <CloseTable
              title="Борлуулалт"
              isQty={true}
              dataSource={getStatisticSale()}
            />
            <CloseTable title="Төлбөр төлөлт" dataSource={getPay()} />
            <CloseTable title="Зээл" dataSource={getLend()} />
          </div>
          <div className="close-content">
            <CloseTable
              title={"Төлөлт-Бэлэн"}
              dataSource={cashDocuments}
              isLoading={isCashLoading}
            />
            <CloseTable title="Төлөлт-Бэлэн бус" dataSource={getNotCash()} />
          </div>
        </div>
      </div>
      <Divider />
      <Title level={3}>
        Нийт зөрүү (Бэлэн + Бэлэн бус + Зээл) = [{cashAmount}] + [
        {nonCashAmount}] + [{lendAmount}] = [-5,000.00]
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          cashAmount: openClose?.cashAmount || 0,
          nonCashAmount: openClose?.nonCashAmount || 0,
          lendAmount: openClose?.lendAmount || 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          <Form.Item label="Бэлэн (тоолсон дүн оруулах)" name={"cashAmount"}>
            <NewInputNumber disabled={openClose?.isClose} />
          </Form.Item>
          <Form.Item label="Бэлэн бус (Settlements)" name={"nonCashAmount"}>
            <NewInputNumber disabled={openClose?.isClose} />
          </Form.Item>
          <Form.Item label="Зээл (тоолсон дүн оруулах)" name={"lendAmount"}>
            <NewInputNumber disabled={openClose?.isClose} />
          </Form.Item>
          <Form.Item label="Данс">
            <NewSelect
              options={[
                {
                  label: "Хаан банк",
                  value: 1,
                },
              ]}
              disabled={openClose?.isClose}
            />
          </Form.Item>
          <Button type="primary" disabled={openClose?.isClose}>
            Settlement татах
          </Button>
        </div>
        <Form.Item label="Тайлбар" name={"description"}>
          <NewSelect
            options={[
              {
                label: "Мөнгө дутсан",
                value: 1,
              },
            ]}
            disabled={openClose?.isClose}
          />
        </Form.Item>
      </Form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <NewDatePicker
          style={{
            minWidth: 140,
          }}
          disabled={openClose?.isClose}
        />
        <Button
          style={{
            width: "100%",
          }}
          disabled={openClose?.isClose}
          danger
          onClick={() =>
            form.validateFields().then((values) => {
              onFinish(values);
            })
          }
        >
          Хаалт хийх
        </Button>
        <button
          className="app-button-regular"
          style={{
            height: 39,
            fontWeight: 400,
            minWidth: 140,
          }}
        >
          <PrinterOutlined />
          Тайлан хэвлэх
        </button>
      </div>
    </div>
  );
};
export default CloseState;
