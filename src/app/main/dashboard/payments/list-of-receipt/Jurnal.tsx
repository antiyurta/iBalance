import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import {
  FilteredColumnsTransaction,
  IDataTransaction,
  IFilterTransaction,
} from "@/service/document/transaction/entities";
import { TransactionService } from "@/service/document/transaction/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Jurnal = () => {
  const [columns, setColumns] = useState<FilteredColumnsTransaction>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
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
    expenseQty: {
      label: "Бараа материалын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "expenseQty",
      type: DataIndexType.MULTI,
    },
    consumerId: {
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
    totalAmount: {
      label: "Нийт дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "amount"],
      type: DataIndexType.VALUE,
    },
    payAmount: {
      label: "Төлөх дүн",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "payAmount"],
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<IDataTransaction[]>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterTransaction>();
  const [params, setParams] = useState<any>();
  const getData = async (param: any) => {
    await TransactionService.get({
      page: 1,
      limit: 10,
      movingStatus: MovingStatus.Pos,
    }).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setFilters(response.response.filter);
        setMeta(response.response.meta);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
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
            isEdit
            onEdit={(e) => console.log(e)}
          />
        </Col>
      </Row>
    </div>
  );
};
export default Jurnal;
