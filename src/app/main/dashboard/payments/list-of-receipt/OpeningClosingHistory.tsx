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
import { useTypedSelector } from "@/feature/store/reducer";
import CloseState from "../open-close/close";
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
          openCloseId={openClose?.id }
          setIsClose={(value) => setIsClose(!value)}
        />
      </NewModal>
    </div>
  );
};
export default OpeningClosingHistory;
