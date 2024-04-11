import { NewTable, TableItemType } from "@/components/table";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import { useContext, useEffect, useState } from "react";
import { QrcodeOutlined, EyeOutlined } from "@ant-design/icons";
import { Col, Row, Space } from "antd";
import Filtered from "@/components/table/filtered";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import ColumnSettings from "@/components/columnSettings";
import Image from "next/image";
import { IDataDocument } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import NewModal from "@/components/modal";
import Bill from "../pos-sales/steps/Step3/Bill";
import TransactionPos from "./components/transaction-pos";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";

const key = "payments/list-of-receipt/return-list";
const ListOfMembershipCardTransactions = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<any>({
    posName: {
      label: "Поссын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["openClose", "pos", "name"],
      type: DataIndexType.MULTI,
    },
    documentCode: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "code"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
    membershipCode: {
      label: "Картын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "code"],
      type: DataIndexType.MULTI,
    },
    membershipName: {
      label: "Карт, эрхийн бичгийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "membership", "name"],
      type: DataIndexType.MULTI,
    },
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    consumerPhone: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "consumer", "phone"],
      type: DataIndexType.MULTI,
    },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["payAmount"],
      type: DataIndexType.VALUE,
    },
    membershipIncreaseAmount: {
      label: "Нэмэгдсэн оноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["membershipIncreaseAmount"],
      type: DataIndexType.VALUE,
    },
    membershipDiscountAmount: {
      label: "Ашигласан оноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["membershipDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    membershipAmount: {
      label: "Үлдэгдэл оноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerMembership", "amount"],
      type: DataIndexType.VALUE,
    },
  });
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [posDocument, setPosDocument] = useState<IDataDocument>();
  const [isBill, setIsBill] = useState<boolean>(false);
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  enum ItemAction {
    SHOW_DOCUMENT = "show-document",
    SHOW_TRANSACTION = "show-transaction",
  }
  const newItems: TableItemType[] = [
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
  ];
  const itemClick = async (key: string, id: string): Promise<void> => {};
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {}, [param]);
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
            data={[]}
            meta={meta}
            columns={columns}
            onColumns={setColumns}
            incomeFilters={[]}
            addItems={newItems}
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
        {/* {posDocument ? <Bill posDocument={posDocument} /> : null} */}
      </NewModal>
      <NewModal
        width={1500}
        title="Поссын борлуулалт"
        open={isTransaction}
        onCancel={() => setIsTransaction(false)}
        footer={null}
        destroyOnClose
      >
        {/* {posDocument ? <TransactionPos selectedDocument={posDocument} /> : null} */}
      </NewModal>
    </div>
  );
};
export default ListOfMembershipCardTransactions;
