"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

//components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { NewTable } from "@/components/table";
import { DataIndexType, Meta } from "@/service/entities";
//service
import { Col, Row, Space } from "antd";
import {
  FilteredColumnsStorageBalance,
  IDataStorageBalance,
  IFilterStorageBalance,
  IParamStorageBalance,
} from "@/service/material/balance/storage-balance/entites";
import { storageBalanceService } from "@/service/material/balance/storage-balance/service";

const Detailed = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataStorageBalance[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterStorageBalance>();
  const [params, setParams] = useState<IParamStorageBalance>();
  const [columns, setColumns] = useState<FilteredColumnsStorageBalance>({
    materialCode: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "material", "code"],
      type: DataIndexType.MULTI,
    },
    materialName: {
      label: "Барааны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "material", "name"],
      type: DataIndexType.MULTI,
    },
    materialSectionId: {
      label: "Бараа материалын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "material", "section", "name"],
      type: DataIndexType.MULTI,
    },
    materialMeasurementId: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "material", "measurement", "name"],
      type: DataIndexType.MULTI,
    },
    materialCountPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "material", "countPackage"],
      type: DataIndexType.MULTI,
    },
    storageId: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["storage", "name"],
      type: DataIndexType.MULTI,
    },
    quantity: {
      label: "Эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: "quantity",
      type: DataIndexType.NUMBER,
    },
  });
  const getData = async (params: IParamStorageBalance) => {
    blockContext.block();
    await storageBalanceService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
    blockContext.unblock();
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
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
                  key,
                  state,
                  column: columns,
                  onColumn: (columns) => setColumns(columns),
                  params,
                  onParams: (params) => setParams(params),
                });
                getData(params ? params : { page: 1, limit: 10 });
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
                    params,
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
            scroll={{
              x: 1000,
            }}
            rowKey="id"
            data={data}
            meta={meta}
            columns={columns}
            onChange={(params) => getData(params)}
            onColumns={(columns) => setColumns(columns)}
            newParams={params}
            onParams={(params) => setParams(params)}
            incomeFilters={filters}
            onEdit={(row) => console.log(row)}
            onDelete={(id) => console.log(id)}
          />
        </Col>
      </Row>
    </div>
  );
};
export default Detailed;
