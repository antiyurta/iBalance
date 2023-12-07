import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable, TableItemType } from "@/components/table";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import {
  FilteredColumnsDocument,
  IDataDocument,
  IParamDocument,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { IFilterTransaction } from "@/service/document/transaction/entities";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Form, Row, Space } from "antd";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  QrcodeOutlined,
  EyeOutlined,
  CreditCardOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import NewModal from "@/components/modal";
import Bill from "../pos-sales/steps/Step3/Bill";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsShoppingCart,
  IDataShoppingCart,
  IFilterShoppingCart,
  IParamShoppingCart,
} from "@/service/pos/shopping-card/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import TransactionPos from "./components/transaction-pos";
import StepIndex from "../pos-sales/steps/StepIndex";
import PosRefund from "../pos-sales/component/pos-refund";
const Jurnal = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsShoppingCart>({
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
    isPaid: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isPaid",
      type: DataIndexType.BOOLEAN_STRING,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    membershipConsumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    membershipConsumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    counter: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "counter",
      type: DataIndexType.MULTI,
    },
    quantity: {
      label: "Борлуулалтын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "quantity",
      type: DataIndexType.MULTI,
    },
    totalAmount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: "totalAmount",
      type: DataIndexType.VALUE,
    },
    materialDiscountAmount: {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: "materialDiscountAmount",
      type: DataIndexType.VALUE,
    },
    membershipDiscountAmount: {
      label: "Харилцагчийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: "membershipDiscountAmount",
      type: DataIndexType.VALUE,
    },
    membershipIncreaseAmount: {
      label: "Ашигласан оноо",
      isView: true,
      isFiltered: false,
      dataIndex: "membershipDiscountAmount",
      type: DataIndexType.VALUE,
    },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: "payAmount",
      type: DataIndexType.VALUE,
    },
    paidAmount: {
      label: "Төлсөн дүн",
      isView: true,
      isFiltered: false,
      dataIndex: "paidAmount",
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<IDataShoppingCart[]>();
  const [params, setParams] = useState<IParamShoppingCart>({
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterShoppingCart>();
  const [isBill, setIsBill] = useState<boolean>(false);
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  const [isPay, setIsPay] = useState<boolean>(false);
  const [isRefund, setIsRefund] = useState<boolean>(false);
  const [posDocument, setPosDocument] = useState<IDataDocument>();
  const [shoppingCart, setShoppingCart] = useState<IDataShoppingCart>();
  enum ItemAction {
    SHOW_DOCUMENT = "show-document",
    SHOW_TRANSACTION = "show-transaction",
    SHOW_PAY = "show-pay",
    SHOW_REFUND = "show-refund",
  }
  const items: TableItemType[] = [
    {
      key: ItemAction.SHOW_DOCUMENT,
      label: (
        <div className="popupButton" style={{ color: "#0D6EFD" }}>
          <QrcodeOutlined width={16} height={16} alt="Баримт харах" />
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
    {
      key: ItemAction.SHOW_TRANSACTION,
      label: (
        <div className="popupButton">
          <EyeOutlined width={16} height={16} alt="Гүйлгээ харах" />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Гүйлгээ харах
          </p>
        </div>
      ),
    },
    {
      key: ItemAction.SHOW_PAY,
      label: (
        <div className="popupButton" style={{ color: "#FFC107" }}>
          <CreditCardOutlined width={16} height={16} alt="Төлөлт бүртгэх" />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Төлөлт бүртгэх
          </p>
        </div>
      ),
    },
    {
      key: ItemAction.SHOW_REFUND,
      label: (
        <div className="popupButton" style={{ color: "#DC3545" }}>
          <DeleteOutlined width={16} height={16} alt="Буцаалт хийх" />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Буцаалт хийх
          </p>
        </div>
      ),
    },
  ];
  const getData = async (params: IParamShoppingCart) => {
    await ShoppingCartService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setFilters(response.response.filter);
        setMeta(response.response.meta);
      }
    });
  };
  const itemClick = async (key: string, id: string): Promise<void> => {
    blockContext.block();
    await ShoppingCartService.getById(id)
      .then((response) => {
        if (response.success) {
          setShoppingCart(response.response);
        }
      })
      .finally(async () => {
        if (shoppingCart) {
          if (key == ItemAction.SHOW_DOCUMENT) {
            if (shoppingCart.transactionDocument) {
              getDocument(shoppingCart.transactionDocument.id).then(() =>
                setIsBill(true)
              );
            } else {
              openNofi("warning", "Гүйлгээний баримт хийгдээгүй байна.");
            }
          } else if (key == ItemAction.SHOW_TRANSACTION) {
            setIsTransaction(true);
          } else if (key == ItemAction.SHOW_PAY) {
            setIsPay(true);
          } else if (key == ItemAction.SHOW_REFUND) {
            setIsRefund(true);
          }
        }
        blockContext.unblock();
      });
  };
  const getDocument = async (id: number) => {
    blockContext.block();
    DocumentService.getById(id)
      .then((response) => {
        if (response.success) {
          setPosDocument(response.response);
        }
      })
      .finally(() => blockContext.unblock());
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
            custom={(key, id) => itemClick(key, String(id))}
          />
        </Col>
      </Row>
      <NewModal
        width={300}
        title="Баримт"
        open={isBill}
        onCancel={() => setIsBill(false)}
      >
        {posDocument ? <Bill posDocument={posDocument} /> : null}
      </NewModal>
      <NewModal
        width={1500}
        title="Поссын борлуулалт"
        open={isTransaction}
        onCancel={() => setIsTransaction(false)}
        footer={null}
        destroyOnClose
      >
        {shoppingCart ? <TransactionPos selectedCart={shoppingCart} /> : null}
      </NewModal>
      <NewModal
        title="Төлбөр төлөх"
        open={isPay}
        onCancel={() => setIsPay(false)}
        footer={null}
        destroyOnClose
      >
        {shoppingCart ? <StepIndex shoppingCart={shoppingCart} /> : null}
      </NewModal>
      <NewModal
        title="Буцаалт хийх"
        open={isRefund}
        onCancel={() => setIsRefund(false)}
        footer={null}
        destroyOnClose
      >
        <PosRefund shoppingCart={shoppingCart} />
      </NewModal>
    </div>
  );
};
export default Jurnal;
