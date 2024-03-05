import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable, TableItemType } from "@/components/table";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsPosOpenClose,
  IDataPosOpenClose,
  IFilterPosOpenClose,
  IParamOpenClose,
} from "@/service/pos/open-close/entities";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { IssuesCloseOutlined } from "@ant-design/icons";
import NewModal from "@/components/modal";
import CloseState from "../open-close/close";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
const key = "payments/list-of-receipt/opening-closing-history";
const OpeningClosingHistory = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsPosOpenClose>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["id"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
    posId: {
      label: "Посын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["posId"],
      type: DataIndexType.NUMBER,
    },
    openerEmployeeName: {
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
      dataIndex: ["openerAt"],
      type: DataIndexType.DATETIME,
    },
    openerAmount: {
      label: "Нээсэн бэлэн мөнгө",
      isView: true,
      isFiltered: false,
      dataIndex: ["openerAmount"],
      type: DataIndexType.VALUE,
    },
    closerEmployeeName: {
      label: "Хаасан хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["closerEmployee", "firstName"],
      type: DataIndexType.MULTI,
    },
    closerAt: {
      label: "Хаасан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["closerAt"],
      type: DataIndexType.DATETIME,
    },
    workingTime: {
      label: "Ажилласан цаг",
      isView: true,
      isFiltered: false,
      dataIndex: ["workingTime"],
      type: DataIndexType.TIME,
    },
    balanceAmount: {
      label: "Мөнгөний илүүдэл (дутагдал)",
      isView: true,
      isFiltered: false,
      dataIndex: ["balanceAmount"],
      type: DataIndexType.VALUE,
    },
    cashAmount: {
      label: "Хаасан бэлэн мөнгө",
      isView: true,
      isFiltered: false,
      dataIndex: ["cashAmount"],
      type: DataIndexType.VALUE,
    },
    nonCashAmount: {
      label: "Хаасан бэлэн бус мөнгө",
      isView: true,
      isFiltered: false,
      dataIndex: ["nonCashAmount"],
      type: DataIndexType.VALUE,
    },
    updatedAt: {
      label: "Зассан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedAt"],
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
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterPosOpenClose>();
  const [isClose, setIsClose] = useState<boolean>(false);
  const [openClose, setOpenClose] = useState<IDataPosOpenClose>();
  enum ItemClose {
    SHOW_CLOSE = "show-close",
  }
  const newItems: TableItemType[] = [
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
  const getData = async () => {
    const params: IParamOpenClose = { ...param };
    await OpenCloseService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
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
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [param]);
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
        <CloseState
          openCloseId={openClose?.id}
          setIsClose={(value) => setIsClose(!value)}
        />
      </NewModal>
    </div>
  );
};
export default OpeningClosingHistory;
