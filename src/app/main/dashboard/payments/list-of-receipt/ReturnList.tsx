import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
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
import { useContext, useEffect, useState } from "react";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
const key = "payments/list-of-receipt/return-list";
const ReturnList = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsDocument>({
    code: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    documentAt: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["documentAt"],
      type: DataIndexType.DATETIME,
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
    incomeCount: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["incomeCount"],
      type: DataIndexType.MULTI,
    },
    incomeQuantity: {
      label: "Борлуулалтын ширхэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["incomeQuantity"],
      type: DataIndexType.MULTI,
    },
    // paymentMethodNames: {
    //   label: "Төлбөрийн хэлбэр",
    //   isView: true,
    //   isFiltered: false,
    //   dataIndex: ["shoppingCart", "invoices", "name"],
    //   type: DataIndexType.MULTI,
    // },
    amount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["amount"],
      type: DataIndexType.VALUE,
    },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["payAmount"],
      type: DataIndexType.VALUE,
    },
    // paidAmount: {
    //   label: "Төлсөн дүн",
    //   isView: true,
    //   isFiltered: false,
    //   dataIndex: ["shoppingCart", "paidAmount"],
    //   type: DataIndexType.VALUE,
    // },
    discountAmount: {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["discountAmount"],
      type: DataIndexType.VALUE,
    },
    membershipDiscountAmount: {
      label: "Ашигласан оноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "membershipDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    giftAmount: {
      label: "Бэлгийн карт",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "giftAmount"],
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<IDataDocument[]>([]);
  const [filters, setFilters] = useState<IFilterDocument>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();

  const getData = async () => {
    const params: IParamDocument = {
      ...param,
      movingStatus: MovingStatus.PosSaleReturn,
    };
    blockContext.block();
    await DocumentService.get(params)
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
