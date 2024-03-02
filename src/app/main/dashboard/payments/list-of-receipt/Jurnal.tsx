import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable, TableItemType } from "@/components/table";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
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
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
import {
  DocumentStatus,
  FilteredColumnsPosDocument,
  IDataPosDocument,
  IFilterPosDocument,
  IParamPosDocument,
} from "@/service/document/pos-document/entites";
import { PosDocumentService } from "@/service/document/pos-document/service";
const key = "payments/list-of-receipt/document";
interface IPopupButtonProp {
  color: string;
  label: string;
  icon: React.ReactNode;
}
const PopupButton: React.FC<IPopupButtonProp> = ({ color, label, icon }) => (
  <div className="popupButton" style={{ color }}>
    {icon}
    <p
      style={{
        margin: 0,
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "16px",
      }}
    >
      {label}
    </p>
  </div>
);
const Jurnal: React.FC = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsPosDocument>({
    code: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "code"],
      type: DataIndexType.MULTI,
    },
    documentAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "documentAt"],
      type: DataIndexType.DATE,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    expenseCount: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "expenseCount"],
      type: DataIndexType.MULTI,
    },
    expenseQuantity: {
      label: "Борлуулалтын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "expenseQuantity"],
      type: DataIndexType.MULTI,
    },
    totalAmount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["totalAmount"],
      type: DataIndexType.VALUE,
    },
    goodsDiscountAmount: {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["goodsDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    membershipPoint: {
      label: "Харилцагчийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["membershipPoint"],
      type: DataIndexType.VALUE,
    },
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
  });
  const [data, setData] = useState<IDataPosDocument[]>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterPosDocument>();
  const [isBill, setIsBill] = useState<boolean>(false);
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  const [isPay, setIsPay] = useState<boolean>(false);
  const [isRefund, setIsRefund] = useState<boolean>(false);
  const [posDocument, setPosDocument] = useState<IDataPosDocument>();
  enum ItemAction {
    SHOW_DOCUMENT = "show-document",
    SHOW_TRANSACTION = "show-transaction",
    SHOW_PAY = "show-pay",
    SHOW_REFUND = "show-refund",
  }
  const newItems: TableItemType[] = [
    {
      key: ItemAction.SHOW_DOCUMENT,
      label: (
        <PopupButton
          icon={<QrcodeOutlined width={16} height={16} alt="Баримт харах" />}
          color={"#0D6EFD"}
          label={"Баримт харах"}
        />
      ),
    },
    {
      key: ItemAction.SHOW_TRANSACTION,
      label: (
        <PopupButton
          icon={<EyeOutlined width={16} height={16} alt="Гүйлгээ харах" />}
          color={"#000"}
          label={"Гүйлгээ харах"}
        />
      ),
    },
    {
      key: ItemAction.SHOW_PAY,
      label: (
        <PopupButton
          icon={
            <CreditCardOutlined width={16} height={16} alt="Төлөлт бүртгэх" />
          }
          color={"#FFC107"}
          label={"Төлөлт бүртгэх"}
        />
      ),
    },
    {
      key: ItemAction.SHOW_REFUND,
      label: (
        <PopupButton
          icon={<DeleteOutlined width={16} height={16} alt="Буцаалт хийх" />}
          color={"#DC3545"}
          label={"Буцаалт хийх"}
        />
      ),
    },
  ];
  const getData = async () => {
    const params: IParamPosDocument = { ...param, status: DocumentStatus.Paid }
    await PosDocumentService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setFilters(response.response.filter);
        setMeta(response.response.meta);
      }
    });
  };
  const itemClick = async (key: string, id: number): Promise<void> => {
    blockContext.block();
    await PosDocumentService.getById(id)
      .then((response) => {
        if (response.success) {
          setPosDocument(response.response);
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
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [param, isRefund]);
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
            addItems={newItems}
            custom={(key, id) => itemClick(key, id)}
          />
        </Col>
      </Row>
      {posDocument && (
        <Bill isBill={isBill} setIsBill={setIsBill} posDocument={posDocument} />
      )}
      <NewModal
        width={1500}
        title="Поссын борлуулалт"
        open={isTransaction}
        onCancel={() => setIsTransaction(false)}
        footer={null}
        destroyOnClose
      >
        <TransactionPos posDocument={posDocument} />
      </NewModal>
      <NewModal
        title="Төлбөр төлөх"
        open={isPay}
        onCancel={() => setIsPay(false)}
        footer={null}
        destroyOnClose
      >
        <StepIndex />
      </NewModal>
      <NewModal
        title="Буцаалт хийх"
        open={isRefund}
        onCancel={() => setIsRefund(false)}
        footer={null}
        destroyOnClose
      >
        <PosRefund posDocument={posDocument} onSave={setIsRefund} />
      </NewModal>
    </div>
  );
};
export default Jurnal;
