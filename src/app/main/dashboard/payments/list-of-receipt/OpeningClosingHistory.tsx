import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable, TableItemType } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsPosOpenClose,
  ICloseDto,
  IDataPosOpenClose,
  IFilterPosOpenClose,
  IParamOpenClose,
} from "@/service/pos/open-close/entities";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { Button, Col, Form, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { IssuesCloseOutlined } from "@ant-design/icons";
import NewModal from "@/components/modal";
import {
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewSelect,
} from "@/components/input";
import dayjs from "dayjs";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { MovingStatus } from "@/service/document/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { PaymentType } from "@/service/reference/payment-method/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import {
  CloseTable,
  StatisticDoc,
  closeNumber,
} from "./components/close-table";
const OpeningClosingHistory = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsPosOpenClose>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
    posId: {
      label: "Посын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "posId",
      type: DataIndexType.NUMBER,
    },
    openerUserId: {
      label: "Нээсэн ажилтан",
      isView: true,
      isFiltered: false,
      dataIndex: ["openerUser", "firstName"],
      type: DataIndexType.MULTI,
    },
    openerAt: {
      label: "Нээсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "openerAt",
      type: DataIndexType.DATETIME,
    },
    openerAmount: {
      label: "Нээсэн бэлэн мөнгө",
      isView: true,
      isFiltered: false,
      dataIndex: "openerAmount",
      type: DataIndexType.VALUE,
    },
    closerUserId: {
      label: "Хаасан хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["closerUser", "firstName"],
      type: DataIndexType.MULTI,
    },
    closerAt: {
      label: "Хаасан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "closerAt",
      type: DataIndexType.DATETIME,
    },
    workingTime: {
      label: "Ажилласан цаг",
      isView: true,
      isFiltered: false,
      dataIndex: "workingTime",
      type: DataIndexType.TIME,
    },
    balanceAmount: {
      label: "Мөнгөний илүүдэл (дутагдал)",
      isView: true,
      isFiltered: false,
      dataIndex: "balanceAmount",
      type: DataIndexType.VALUE,
    },
    cashAmount: {
      label: "Хаасан бэлэн мөнгө",
      isView: true,
      isFiltered: false,
      dataIndex: "cashAmount",
      type: DataIndexType.VALUE,
    },
    nonCashAmount: {
      label: "Хаасан бэлэн бус мөнгө",
      isView: true,
      isFiltered: false,
      dataIndex: "cashAmount",
      type: DataIndexType.VALUE,
    },
    updatedAt: {
      label: "Зассан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATETIME,
    },
    updatedBy: {
      label: "Зассан хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  const [data, setData] = useState<IDataPosOpenClose[]>();
  const [params, setParams] = useState<IParamOpenClose>({
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterPosOpenClose>();
  const [isClose, setIsClose] = useState<boolean>(false);
  const [openClose, setOpenClose] = useState<IDataPosOpenClose>();
  const [cashDocuments, setCashDocuments] = useState<StatisticDoc[]>([]);
  const [isCashLoading, setIsCashLoading] = useState<boolean>(false);
  enum ItemClose {
    SHOW_CLOSE = "show-close",
  }
  const items: TableItemType[] = [
    {
      key: ItemClose.SHOW_CLOSE,
      label: (
        <div className="popupButton" style={{ color: "#0D6EFD" }}>
          <IssuesCloseOutlined width={16} height={16} alt="Баримт харах" />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Баримт харах
          </p>
        </div>
      ),
    },
  ];
  const getData = async (params: IParamOpenClose) => {
    await OpenCloseService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  const getOpenClose = async (id: number) => {
    blockContext.block();
    await OpenCloseService.getById(id)
      .then((response) => {
        if (response.success) {
          setOpenClose(response.response);
          setIsClose(true);
          getStatisticCash(id);
          response.response.shoppingCarts;
        }
      })
      .finally(() => blockContext.unblock());
  };
  const getStatisticSale = (
    shoppingCarts: IDataShoppingCart[]
  ): StatisticDoc[] => {
    const totalSale: StatisticDoc = {
      state: "Нийт борлуулалт",
      qty: closeNumber({ value: shoppingCarts.length }),
      amount: closeNumber({
        value:
          shoppingCarts.reduce(
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
    const paymentMethodIds: number[] = await ReferencePaymentMethodService.get({
      type: PaymentType.Cash,
    }).then((response) => {
      if (!response.success) return [];
      return response.response.map((item) => item.id);
    });
    if (!openCloseId) return [];
    const shoppingCarts = await ShoppingCartService.get({
      openCloseId,
      paymentMethodIds,
    }).then((response) => {
      if (!response.success) return [];
      return response.response.data;
    });
    const totalCash: StatisticDoc = {
      state: "Нийт бэлэн борлуулалт",
      amount: shoppingCarts.reduce(
        (total, item) => total + Number(item.transactionDocument?.amount),
        0
      ),
    };
    const beginingCash: StatisticDoc = {
      state: "Эхэлсэн мөнгө",
      amount: Number(openClose?.openerAmount),
    };
    const addCash: StatisticDoc = {
      state: "Нэмсэн",
      amount: 0,
    };
    const diffCash: StatisticDoc = {
      state: "Хассан",
      amount: 0,
    };
    const refundCash: StatisticDoc = {
      state: "Буцаалт хасах",
      amount: 0,
    };
    const realCash: StatisticDoc = {
      state: "Байх ёстой үлдэгдэл",
      amount: 0,
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
      diffCash,
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
            setIsClose(false);
            getData(params);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getData(params);
  }, []);
  return (
    <div>
      <Row gutter={[0, 12]}>
        <Col sm={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            <Filtered
              columns={columns}
              isActive={(key, state) => {
                onCloseFilterTag({
                  key: key,
                  state: state,
                  column: columns,
                  onColumn: (columns) => setColumns(columns),
                  params: params,
                  onParams: (params) => setParams(params),
                });
                getData(params);
              }}
            />
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              size={12}
            >
              <ColumnSettings
                columns={columns}
                columnIndexes={(arg1, arg2) =>
                  findIndexInColumnSettings({
                    newRowIndexes: arg1,
                    unSelectedRow: arg2,
                    columns: columns,
                    onColumns: (columns) => setColumns(columns),
                    params: params,
                    onParams: (params) => setParams(params),
                    getData: (params) => getData(params),
                  })
                }
              />
              <Image
                src={"/images/PrintIcon.svg"}
                width={24}
                height={24}
                alt="printIcon"
              />
              <Image
                src={"/images/DownloadIcon.svg"}
                width={24}
                height={24}
                alt="downloadIcon"
              />
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <NewTable
            scroll={{ x: 1000 }}
            rowKey="id"
            doubleClick={true}
            data={data}
            meta={meta}
            columns={columns}
            onChange={getData}
            onColumns={setColumns}
            newParams={params}
            onParams={setParams}
            incomeFilters={filters}
            addItems={items}
            custom={(_, id) => getOpenClose(id)}
          />
        </Col>
      </Row>
      <NewModal
        title="Хаалт хийх"
        open={isClose}
        onCancel={() => setIsClose(false)}
        footer={null}
        width={1500}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={{
            closeAt: dayjs(new Date()),
          }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={12}>
              <CloseTable
                title={"Борлуулалт"}
                isQty={true}
                dataSource={getStatisticSale(openClose?.shoppingCarts || [])}
              />
            </Col>
            <Col span={12}>
              <CloseTable
                title={"Төлөлт-Бэлэн"}
                dataSource={cashDocuments}
                isLoading={isCashLoading}
              />
            </Col>
            <Col span={12}>
              <CloseTable title={"Төлбөр төлөлт"} dataSource={getPay()} />
            </Col>
            <Col span={12}>
              <CloseTable title="Төлөлт-Бэлэн бус" dataSource={getNotCash()} />
            </Col>
            <Col span={12}>
              <CloseTable title="Зээл" dataSource={getLend()} />
            </Col>
            <Col span={24}>
              Нийт зөрүү (Бэлэн + Бэлэн бус) = [-5,000.00] + [0.00] =
              [-5,000.00]
            </Col>
            <Col span={8}>
              <Form.Item
                label={"Бэлэн (тоолсон дүн оруулах)"}
                name={"cashAmount"}
              >
                <NewInputNumber />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={"Зээл (Тооцоо нийлэлт)"} name={"lendAmount"}>
                <NewInputNumber />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={"Бэлэн бус (Settlements)"}
                name={"nonCashAmount"}
              >
                <NewInputNumber />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={"Бэлэн (тоолсон дүн оруулах)"}>
                <NewSelect options={[{ value: "1", label: "Хаан банкны" }]} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Settlement татах
              </Button>
            </Col>
            <Col span={24}>
              <Form.Item label={"Бэлэн (тоолсон дүн оруулах)"}>
                <NewInput />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={"Хаах өдөр"} name={"closeAt"}>
                <NewDatePicker disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button type="primary" danger htmlType="submit">
                Хаалт хийх
              </Button>
            </Col>
            <Col span={6}>
              <Button type="default" htmlType="submit">
                Тайлан хэвлэх
              </Button>
            </Col>
          </Row>
        </Form>
      </NewModal>
    </div>
  );
};
export default OpeningClosingHistory;
