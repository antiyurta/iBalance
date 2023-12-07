import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsPosRefund,
  IDataPosRefund,
  IFilterPosRefund,
  IParamPosRefund,
} from "@/service/pos/refund/entities";
import { PosRefundService } from "@/service/pos/refund/service";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const ReturnList = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsPosRefund>({
    shoppingCartId: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "shoppingCartId",
      type: DataIndexType.MULTI,
    },
    shoppingCartCreatedAt: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "createdAt"],
      type: DataIndexType.MULTI,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "pos", "warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "consumerMembership", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "consumerMembership", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    shoppingCartCounter: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "counter"],
      type: DataIndexType.MULTI,
    },
    shoppingCartQuantity: {
      label: "Борлуулалтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "quantity"],
      type: DataIndexType.MULTI,
    },
    paymentMethodNames: {
      label: "Төлбөрийн хэлбэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "invoices", "name"],
      type: DataIndexType.MULTI,
    },
    totalAmount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "totalAmount"],
      type: DataIndexType.VALUE,
    },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "payAmount"],
      type: DataIndexType.VALUE,
    },
    paidAmount: {
      label: "Төлсөн дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "payAmount"],
      type: DataIndexType.VALUE,
    },
    materialDiscountAmount: {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "materialDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    membershipDiscountAmount: {
      label: "Ашигласан оноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["shoppingCart", "materialDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    giftDiscountAmount: {
      label: "Бэлгийн карт",
      isView: true,
      isFiltered: false,
      dataIndex: "giftDiscountAmount",
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<IDataPosRefund[]>([]);
  const [filters, setFilters] = useState<IFilterPosRefund>();
  const [params, setParams] = useState<IParamPosRefund>({ page: 1, limit: 10 });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [refund, setRefund] = useState<IDataPosRefund>();

  const getData = async (params: IParamPosRefund) => {
    blockContext.block();
    await PosRefundService.get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
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
          />
        </Col>
      </Row>
    </div>
  );
};
export default ReturnList;
