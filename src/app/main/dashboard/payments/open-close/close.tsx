import { NewDatePicker, NewInputNumber } from "@/components/input";
import { Button, Divider, Form, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ICloseDto,
  IDataPosOpenClose,
} from "@/service/pos/open-close/entities";
import CloseTable, {
  ICloseColumn,
} from "../list-of-receipt/components/close-table";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { PaymentType } from "@/service/reference/payment-method/entities";
import { PosInvoiceService } from "@/service/pos/invoice/service";
import { IDataPaymentInvoice } from "@/service/pos/invoice/entities";
import { useWatch } from "antd/es/form/Form";
import { PosDocumentService } from "@/service/document/pos-document/service";
import { Operator } from "@/service/entities";
import {
  DocumentStatus,
  IDataPosDocument,
} from "@/service/document/pos-document/entites";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";

const { Title } = Typography;
interface IProps {
  closeDate?: string;
  openCloseId?: number;
  setIsClose: (value: boolean) => void;
}
const CloseState = (props: IProps) => {
  const { closeDate, openCloseId, setIsClose } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<ICloseDto>();
  const [openClose, setOpenClose] = useState<IDataPosOpenClose>();
  const [posDocuments, setPosDocuments] = useState<IDataPosDocument[]>([]);
  const [invoices, setInvoices] = useState<IDataPaymentInvoice[]>([]);
  const cashAmount = useWatch("cashAmount", form);
  const nonCashAmount = useWatch("nonCashAmount", form);
  const lendAmount = useWatch("lendAmount", form);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const getOpenClose = () => {
    if (openCloseId) {
      blockContext.block();
      OpenCloseService.getById(openCloseId)
        .then((response) => {
          if (response.success) {
            setOpenClose(response.response);
            form.setFieldsValue({
              cashAmount: Number(response.response.cashAmount),
              nonCashAmount: Number(response.response.nonCashAmount),
              lendAmount: Number(response.response.lendAmount),
            });
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const getPosDocument = () => {
    if (openCloseId) {
      blockContext.block();
      PosDocumentService.get({
        filters: [
          {
            dataIndex: ["openCloseId"],
            operator: Operator.Equals,
            filter: openCloseId,
          },
        ],
      })
        .then((response) => {
          if (response.success) {
            setPosDocuments(response.response.data);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const getInvoices = () => {
    if (openCloseId) {
      blockContext.block();
      PosInvoiceService.get({ openCloseId, isPaid: true })
        .then((response) => {
          if (response.success) {
            setInvoices(response.response);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getOpenClose();
    getPosDocument();
    getInvoices();
  }, []);
  const getSaleAmount = (type: PaymentType): number => {
    return invoices
      .filter((item) => item.type == type)
      .reduce(
        (total, item) =>
          total +
          (Number(item.incomeAmount) || 0) -
          (Number(item.expenseAmount) || 0),
        0
      );
  };
  const getStatisticSale = (): ICloseColumn[] => {
    const refundDocuments = posDocuments.filter(
      (item) => item.status == DocumentStatus.Refund
    );
    const total = posDocuments.reduce(
      (total, item) => total + Number(item.paidAmount),
      0
    );
    const refund = refundDocuments.reduce(
      (total, item) => total + Number(item.paidAmount),
      0
    );
    return [
      {
        state: "Нийт борлуулалт",
        qty: { value: posDocuments.length },
        amount: { value: total },
      },
      {
        state: "Буцаалт",
        qty: { value: refundDocuments.length },
        amount: { value: refund },
      },
      {
        state: "Бараа материалын хөнгөлөлт, урамшуулал",
        qty: { value: 0 },
        amount: { value: 0 },
      },
      {
        state: "Харилцагч, гишүүнчлэлийн хөнгөлөлт",
        qty: { value: 0 },
        amount: { value: 0 + 0 },
      },
      {
        state: <div style={{ fontWeight: "bold" }}>Цэвэр борлуулалт</div>,
        qty: { value: 0, isBold: true },
        amount: {
          value: total - refund,
          isBold: true,
        },
      },
    ];
  };
  const getCash = (): ICloseColumn[] => {
    const columns = [
      {
        state: "Нийт бэлэн борлуулалт",
        amount: { value: getSaleAmount(PaymentType.Cash) },
      },
      {
        state: "Эхэлсэн мөнгө",
        amount: { value: Number(openClose?.openerAmount) || 0 },
      },
      {
        state: "Нэмсэн",
        amount: { value: 0 },
      },
      {
        state: "Хассан",
        amount: { value: 0, isBracket: true },
      },
      {
        state: "Буцаалт хасах",
        amount: { value: 0, isBracket: true },
      },
    ];
    const realCash: ICloseColumn = {
      state: "Байх ёстой үлдэгдэл",
      amount: {
        value: columns.reduce((total, item) => total + item.amount.value, 0),
      },
    };
    const cencusCash: ICloseColumn = {
      state: "Тоолсон",
      amount: { value: cashAmount },
    };
    const cencusMoney = cashAmount - realCash.amount.value;
    const excessDeficiency: ICloseColumn = {
      state: (
        <>
          <div style={{ display: "flex", gap: 2 }}>
            <span>Илүүдсэн</span>
            <div style={{ color: "red" }}>(Дутсан)</div>
          </div>
        </>
      ),
      amount: {
        value: cencusMoney,
        isBracket: cencusMoney < 0,
        isDanger: cencusMoney < 0,
      },
    };
    return [...columns, realCash, cencusCash, excessDeficiency];
  };
  const getPay = (): ICloseColumn[] => {
    const cash: ICloseColumn = {
      state: "Бэлэн",
      amount: { value: getSaleAmount(PaymentType.Cash) },
    };
    const notCash: ICloseColumn = {
      state: "Бэлэн бус",
      amount: { value: getSaleAmount(PaymentType.NotCash) },
    };
    const lend: ICloseColumn = {
      state: "Зээл",
      amount: { value: getSaleAmount(PaymentType.Lend) },
    };
    const gift: ICloseColumn = {
      state: "Бэлгийн карт, эрхийн бичиг",
      amount: { value: getSaleAmount(PaymentType.GiftCart) },
    };
    const membership: ICloseColumn = {
      state: "Ашигласан оноогоор /гишүүнчлэл/",
      amount: { value: getSaleAmount(PaymentType.Membership) },
    };
    const pre: ICloseColumn = {
      state: "Урьдчилгаа",
      amount: { value: 0 },
    };
    const total: ICloseColumn = {
      state: "Нийт төлөлт",
      amount: {
        value:
          cash.amount.value +
          notCash.amount.value +
          lend.amount.value +
          gift.amount.value +
          membership.amount.value,
      },
    };
    return [cash, notCash, lend, gift, membership, pre, total];
  };
  const getNotCash = (): ICloseColumn[] => {
    const notCashInvoices = invoices.filter(
      (item) => item.type == PaymentType.NotCash
    );
    const columns: ICloseColumn[] = notCashInvoices.reduce(
      (result: ICloseColumn[], item: IDataPaymentInvoice) => {
        const existingItemIndex = result.findIndex(
          (col) => col.state === item.paymentMethodName
        );
        const incomeAmount = Number(item.incomeAmount) || 0;
        if (existingItemIndex !== -1) {
          result[existingItemIndex].amount.value =
            result[existingItemIndex].amount.value + incomeAmount;
        } else {
          result.push({
            state: item.paymentMethodName,
            amount: { value: incomeAmount },
          });
        }
        return result;
      },
      []
    );
    const notCashDoc: ICloseColumn[] = [
      {
        state: "Нийт бэлэн бус борлуулалт",
        amount: { value: getSaleAmount(PaymentType.NotCash) },
      },
      ...columns,
      {
        state: "Нэмсэн",
        amount: { value: 0 },
      },
      {
        state: "Хассан",
        amount: { value: 0, isBracket: true },
      },
      {
        state: "Байх ёстой үлдэгдэл",
        amount: { value: getSaleAmount(PaymentType.NotCash) },
      },
      {
        state: "Settlements",
        amount: { value: nonCashAmount - getSaleAmount(PaymentType.NotCash) },
      },
    ];
    return notCashDoc;
  };
  const getLend = (): ICloseColumn[] => {
    const cash: ICloseColumn = {
      state: "Нийт зээл борлуулалт",
      amount: { value: getSaleAmount(PaymentType.Lend) },
    };
    const notCash: ICloseColumn = {
      state: "Тооцоо нийлсэн",
      amount: { value: lendAmount },
    };
    const cencusAmount = lendAmount - cash.amount.value;
    const lend: ICloseColumn = {
      state: (
        <>
          <div style={{ display: "flex" }}>
            Илүүдсэн <div style={{ color: "red" }}>(Дутсан)</div>
          </div>
        </>
      ),
      amount: {
        value: cencusAmount,
        isBracket: cencusAmount < 0,
        isDanger: cencusAmount < 0,
      },
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
    getCash();
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
      <div className="open-close-close" ref={printRef}>
        <p className="title">Хаалтын тайлан</p>
        <p className="close-date">
          Хаалтын огноо:
          {closeDate ? dayjs(closeDate).format("YYYY/MM/DD HH:mm") : null}
        </p>
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
            <CloseTable title={"Төлөлт-Бэлэн"} dataSource={getCash()} />
            <CloseTable title="Төлөлт-Бэлэн бус" dataSource={getNotCash()} />
          </div>
        </div>
        <Divider />
        <Title level={3}>
          Нийт зөрүү (Бэлэн + Бэлэн бус + Зээл) = [{cashAmount}] + [
          {nonCashAmount}] + [{lendAmount}] = [
          {Number(cashAmount) + Number(nonCashAmount) + Number(lendAmount)}]
        </Title>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          cashAmount: 0,
          nonCashAmount: 0,
          lendAmount: 0,
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
        </div>
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
          defaultValue={closeDate ? dayjs(closeDate) : undefined}
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
        <Button type="primary" onClick={() => handlePrint()}>
          <PrinterOutlined />
          Тайлан хэвлэх
        </Button>
      </div>
    </div>
  );
};
export default CloseState;
