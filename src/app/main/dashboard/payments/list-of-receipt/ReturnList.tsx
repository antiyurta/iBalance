import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";
import {
  DocumentStatus,
  FilteredColumnsPosDocument,
  IDataPosDocument,
  IFilterPosDocument,
  IParamPosDocument,
} from "@/service/document/pos-document/entites";
import { PosDocumentService } from "@/service/document/pos-document/service";
const key = "payments/list-of-receipt/return-list";
const ReturnList: React.FC = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsPosDocument>({
    code: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "code"],
      type: DataIndexType.MULTI,
    },
    documentAt: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "documentAt"],
      type: DataIndexType.DATETIME,
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
    incomeCount: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "incomeCount"],
      type: DataIndexType.MULTI,
    },
    incomeQuantity: {
      label: "Борлуулалтын ширхэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "incomeQuantity"],
      type: DataIndexType.MULTI,
    },
    totalAmount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["totalAmount"],
      type: DataIndexType.VALUE,
    },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["payAmount"],
      type: DataIndexType.VALUE,
    },
    paidAmount: {
      label: "Төлсөн дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["paidAmount"],
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
      label: "Ашигласан оноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["membershipPoint"],
      type: DataIndexType.VALUE,
    },
    giftCartPoint: {
      label: "Бэлгийн карт",
      isView: true,
      isFiltered: false,
      dataIndex: ["giftCartPoint"],
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<IDataPosDocument[]>([]);
  const [filters, setFilters] = useState<IFilterPosDocument>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();

  const getData = async () => {
    blockContext.block();
    const params: IParamPosDocument = {
      ...param,
      status: DocumentStatus.Refund,
    };
    await PosDocumentService.get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setFilters(response.response.filter);
          setMeta(response.response.meta);
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
          />
        </Col>
      </Row>
    </div>
  );
};
export default ReturnList;
