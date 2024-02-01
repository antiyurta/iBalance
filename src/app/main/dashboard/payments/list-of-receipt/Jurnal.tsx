import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable, TableItemType } from "@/components/table";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import {
  FilteredColumnsDocument,
  IDataDocument,
  IFilterDocument,
  IParamDocument,
  MovingStatus,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
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
import TransactionPos from "./components/transaction-pos";
import StepIndex from "../pos-sales/steps/StepIndex";
import PosRefund from "../pos-sales/component/pos-refund";
const Jurnal = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsDocument>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["id"],
      type: DataIndexType.MULTI,
    },
    documentAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["documentAt"],
      type: DataIndexType.DATE,
    },
    status: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["status"],
      type: DataIndexType.ENUM,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    expenseCount: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["expenseCount"],
      type: DataIndexType.MULTI,
    },
    expenseQuantity: {
      label: "Борлуулалтын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["expenseQuantity"],
      type: DataIndexType.MULTI,
    },
    amount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["amount"],
      type: DataIndexType.VALUE,
    },
    discountAmount: {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["discountAmount"],
      type: DataIndexType.VALUE,
    },
    consumerDiscountAmount: {
      label: "Харилцагчийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    // membershipIncreaseAmount: {
    //   label: "Ашигласан оноо",
    //   isView: true,
    //   isFiltered: false,
    //   dataIndex: "membershipDiscountAmount",
    //   type: DataIndexType.VALUE,
    // },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["payAmount"],
      type: DataIndexType.VALUE,
    },
    isEbarimt: {
      label: "Ибаримтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isEbarimt"],
      type: DataIndexType.BOOLEAN,
    },
    // paidAmount: {
    //   label: "Төлсөн дүн",
    //   isView: true,
    //   isFiltered: false,
    //   dataIndex: "paidAmount",
    //   type: DataIndexType.VALUE,
    // },
  });
  const [data, setData] = useState<IDataDocument[]>();
  const [params, setParams] = useState<IParamDocument>({
    page: 1,
    limit: 10,
    movingStatus: MovingStatus.Pos,
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterDocument>();
  const [isBill, setIsBill] = useState<boolean>(false);
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  const [isPay, setIsPay] = useState<boolean>(false);
  const [isRefund, setIsRefund] = useState<boolean>(false);
  const [document, setDocument] = useState<IDataDocument>();
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
  const getData = async (params: IParamDocument) => {
    await DocumentService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setFilters(response.response.filter);
        setMeta(response.response.meta);
      }
    });
  };
  const itemClick = async (key: string, id: number): Promise<void> => {
    blockContext.block();
    await DocumentService.getById(id)
      .then((response) => {
        if (response.success) {
          setDocument(response.response);
        }
      })
      .finally(async () => {
        if (document) {
          if (key == ItemAction.SHOW_DOCUMENT) {
            setIsBill(true);
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
  useEffect(() => {
    getData(params);
  }, [isRefund]);
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
            <Filtered columns={columns} />
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
            onColumns={setColumns}
            incomeFilters={filters}
            addItems={items}
            custom={(key, id) => itemClick(key, id)}
          />
        </Col>
      </Row>
      <NewModal
        width={300}
        title="Баримт"
        open={isBill}
        onCancel={() => setIsBill(false)}
      >
        {document ? <Bill posDocument={document} /> : null}
      </NewModal>
      <NewModal
        width={1500}
        title="Поссын борлуулалт"
        open={isTransaction}
        onCancel={() => setIsTransaction(false)}
        footer={null}
        destroyOnClose
      >
        <TransactionPos selectedDocument={document} />
      </NewModal>
      <NewModal
        title="Төлбөр төлөх"
        open={isPay}
        onCancel={() => setIsPay(false)}
        footer={null}
        destroyOnClose
      >
        {document?.shoppingCart ? (
          <StepIndex shoppingCart={document.shoppingCart} />
        ) : null}
      </NewModal>
      <NewModal
        title="Буцаалт хийх"
        open={isRefund}
        onCancel={() => setIsRefund(false)}
        footer={null}
        destroyOnClose
      >
        <PosRefund posDocument={document} onSave={setIsRefund} />
      </NewModal>
    </div>
  );
};
export default Jurnal;
