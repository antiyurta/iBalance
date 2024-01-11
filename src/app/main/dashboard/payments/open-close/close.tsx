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
import { PaymentType } from "@/service/reference/payment-method/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { MoneyTransactionService } from "@/service/pos/money-transaction/service";
import { MovingStatus } from "@/service/document/entities";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import dayjs from "dayjs";
import { PosInvoiceService } from "@/service/pos/invoice/service";
import { IDataPaymentInvoice } from "@/service/pos/invoice/entities";

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
  const [cashInvoices, setCashInvoices] = useState<IDataPaymentInvoice[]>([]);
  const [notcashInvoices, setNotcashInvoices] = useState<IDataPaymentInvoice[]>(
    []
  );
  const [lendInvoices, setLendInvoices] = useState<IDataPaymentInvoice[]>([]);

  const getOpenClose = async (id: number) => {
    blockContext.block();
    await OpenCloseService.getById(id)
      .then((response) => {
        if (response.success) {
          setOpenClose(response.response);
          response.response.shoppingCarts;
        }
      })
      .finally(() => blockContext.unblock());
  };
  const getPayMethod = async () => {
    PosInvoiceService.get({ openCloseId, type: PaymentType.Cash }).then(
      (response) => {
        if (response.success) {
          setCashInvoices(response.response);
        }
      }
    );
    PosInvoiceService.get({ openCloseId, type: PaymentType.NotCash }).then(
      (response) => {
        if (response.success) {
          setNotcashInvoices(response.response);
        }
      }
    );
    PosInvoiceService.get({ openCloseId, type: PaymentType.Lend }).then(
      (response) => {
        if (response.success) {
          setLendInvoices(response.response);
        }
      }
    );
  };
  const getStatisticSale = (
    shoppingCarts: IDataShoppingCart[]
  ): StatisticDoc[] => {
    const totalSale: StatisticDoc = {
      state: "Нийт борлуулалт",
      qty: closeNumber({ value: shoppingCarts.length }),
      amount: closeNumber({
        value: shoppingCarts.reduce(
          (total, item) => total + Number(item.totalAmount),
          0
        ),
      }),
    };
    const refundShoppingCarts = shoppingCarts.filter(
      (item) =>
        item.transactionDocument?.movingStatus == MovingStatus.PosSaleReturn
    );
    const refund: StatisticDoc = {
      state: "Буцаалт",
      qty: closeNumber({ value: refundShoppingCarts.length, isBracket: true }),
      amount: closeNumber({
        value: refundShoppingCarts.reduce(
          (total, item) => total + Number(item.transactionDocument?.amount),
          0
        ),
        isBracket: true,
      }),
    };
    const materialShoppingCarts = shoppingCarts.filter(
      (item) => item.transactionDocument?.discountAmount || 0 > 0
    );
    const materialDiscount: StatisticDoc = {
      state: "Бараа материалын хөнгөлөлт, урамшуулал",
      qty: closeNumber({ value: materialShoppingCarts.length }),
      amount: closeNumber({
        value: materialShoppingCarts.reduce(
          (total, item) =>
            total + Number(item.transactionDocument?.discountAmount),
          0
        ),
      }),
    };
    const consumerShoppingCarts = shoppingCarts.filter(
      (item) => Number(item.membershipDiscountAmount) > 0
    );
    const consumerDiscount: StatisticDoc = {
      state: "Харилцагч, гишүүнчлэлийн хөнгөлөлт",
      qty: closeNumber({ value: consumerShoppingCarts.length }),
      amount: closeNumber({
        value: consumerShoppingCarts.reduce(
          (total, item) => total + Number(item.membershipDiscountAmount),
          0
        ),
      }),
    };
    const realShoppingCarts = shoppingCarts.filter(
      (item) =>
        item.transactionDocument?.movingStatus !== MovingStatus.PosSaleReturn
    );
    const sale: StatisticDoc = {
      state: <div style={{ fontWeight: "bold" }}>Цэвэр борлуулалт</div>,
      qty: closeNumber({ value: realShoppingCarts.length, isBold: true }),
      amount: closeNumber({
        value: realShoppingCarts.reduce(
          (total, item) => total + Number(item.payAmount),
          0
        ),
        isBold: true,
      }),
    };
    return [totalSale, refund, materialDiscount, consumerDiscount, sale];
  };
  const getStatisticCash = async (openCloseId?: number) => {
    setIsCashLoading(true);
    if (!openCloseId) return [];
    const moneyTransactions = await MoneyTransactionService.get({
      openCloseId: openCloseId,
    }).then((response) => {
      if (!response.success) return [];
      return response.response.data;
    });
    const saleMoney = cashInvoices.reduce(
      (total, item) => total + Number(item.amount),
      0
    );
    const beginingMoney = openClose?.openerAmount || 0;
    const addMoney = moneyTransactions.reduce(
      (total, item) => total + Number(item.increaseAmount),
      0
    );
    const subtractMoney = moneyTransactions.reduce(
      (total, item) => total + Number(item.decreaseAmount),
      0
    );
    const shoppingCarts = await ShoppingCartService.get({ openCloseId, invoiceType: PaymentType.Cash }).then((response) => {
      if (!response.success) return [];
      return response.response.data;
    });
    const refundShoppingCarts = shoppingCarts.filter(
      (item) =>
        item.transactionDocument?.movingStatus == MovingStatus.PosSaleReturn
    );
    const refundMoney = refundShoppingCarts.reduce(
      (total, item) => total + Number(item.transactionDocument?.amount),
      0
    );
    const realMoney =
      saleMoney + beginingMoney + addMoney - subtractMoney - refundMoney;
    const totalCash: StatisticDoc = {
      state: "Нийт бэлэн борлуулалт",
      amount: closeNumber({ value: saleMoney }),
    };
    const beginingCash: StatisticDoc = {
      state: "Эхэлсэн мөнгө",
      amount: closeNumber({ value: beginingMoney }),
    };
    const addCash: StatisticDoc = {
      state: "Нэмсэн",
      amount: closeNumber({ value: addMoney }),
    };
    const subtractCash: StatisticDoc = {
      state: "Хассан",
      amount: closeNumber({ value: subtractMoney, isBracket: true }),
    };
    const refundCash: StatisticDoc = {
      state: "Буцаалт хасах",
      amount: closeNumber({ value: refundMoney, isBracket: true }),
    };
    const realCash: StatisticDoc = {
      state: "Байх ёстой үлдэгдэл",
      amount: closeNumber({ value: realMoney }),
    };
    const cencusCash: StatisticDoc = {
      state: "Тоолсон",
      amount: 0,
    };
    const excessDeficiency: StatisticDoc = {
      state: (
        <>
          <div style={{ display: "flex" }}>
            Илүүдсэн <div style={{ color: "red" }}>(Дутсан)</div>
          </div>
        </>
      ),
      amount: 0,
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
      amount: 0,
    };
    const notCash: StatisticDoc = {
      state: "Бэлэн бус",
      amount: 0,
    };
    const lend: StatisticDoc = {
      state: "Зээл",
      amount: 0,
    };
    const gift: StatisticDoc = {
      state: "Бэлгийн карт, эрхийн бичиг",
      amount: 0,
    };
    const membership: StatisticDoc = {
      state: "Ашигласан оноогоор /гишүүнчлэл/",
      amount: 0,
    };
    const pre: StatisticDoc = {
      state: "Урьдчилгаа",
      amount: 0,
    };
    const total: StatisticDoc = {
      state: "Нийт төлөлт",
      amount: 0,
    };
    return [cash, notCash, lend, gift, membership, pre, total];
  };
  const getNotCash = (): StatisticDoc[] => {
    const cash: StatisticDoc = {
      state: "Нийт бэлэн бус борлуулалт",
      amount: 0,
    };
    const notCash: StatisticDoc = {
      state: "Хаан банк",
      amount: 0,
    };
    const lend: StatisticDoc = {
      state: "Хас банк",
      amount: 0,
    };
    const gift: StatisticDoc = {
      state: "Голомт банк",
      amount: 0,
    };
    const membership: StatisticDoc = {
      state: "Нэмсэн",
      amount: 0,
    };
    const pre: StatisticDoc = {
      state: "Хассан",
      amount: 0,
    };
    const total: StatisticDoc = {
      state: "Байх ёстой үлдэгдэл",
      amount: 0,
    };
    const settlement: StatisticDoc = {
      state: "Settlements",
      amount: 0,
    };
    return [cash, notCash, lend, gift, membership, pre, total, settlement];
  };
  const getLend = (): StatisticDoc[] => {
    const cash: StatisticDoc = {
      state: "Нийт борлуулалт",
      amount: 0,
    };
    const notCash: StatisticDoc = {
      state: "Тооцоо нийлсэн",
      amount: 0,
    };
    const lend: StatisticDoc = {
      state: "Илүүдсэн дутсан",
      amount: 0,
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
    getStatisticCash(openCloseId);
    getPayMethod();
  }, []);
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
              dataSource={getStatisticSale(openClose?.shoppingCarts || [])}
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
        Нийт зөрүү (Бэлэн + Бэлэн бус) = [-5,000.00] + [0.00] = [-5,000.00]
      </Title>
      {!openClose?.isClose && (
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            <Form.Item label="Бэлэн (тоолсон дүн оруулах)" name={"cashAmount"}>
              <NewInputNumber />
            </Form.Item>
            <Form.Item label="Бэлэн бус (Settlements)" name={"nonCashAmount"}>
              <NewInputNumber />
            </Form.Item>
            <Form.Item label="Данс">
              <NewSelect
                options={[
                  {
                    label: "Хаан банк",
                    value: 1,
                  },
                ]}
              />
            </Form.Item>
            <Button type="primary">Settlement татах</Button>
          </div>
          <Form.Item label="Тайлбар" name={"description"}>
            <NewSelect
              options={[
                {
                  label: "Мөнгө дутсан",
                  value: 1,
                },
              ]}
            />
          </Form.Item>
        </Form>
      )}
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
