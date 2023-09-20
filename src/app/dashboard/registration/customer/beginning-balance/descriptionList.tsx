"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import Image from "next/image";
import { useEffect, useState } from "react";
import { limitOfLoansAccountService } from "@/service/limit-of-loans/account/service";
import {
  FilteredColumnsLimitOfLoansAccount,
  IDataLimitOfLoansAccount,
} from "@/service/limit-of-loans/account/entities";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { NewTable } from "@/components/table";
import { Col, Row, Space } from "antd";
import { balanceAccountService } from "@/service/consumer/initial-balance/account/service";
import {
  IDataBalanceAccount,
  IFilterBalanceAccount,
  IParamBalanceAccount,
} from "@/service/consumer/initial-balance/account/entities";

const DescriptionList = () => {
  const [data, setData] = useState<IDataBalanceAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBalanceAccount>();
  const [newParams, setNewParams] = useState<IParamBalanceAccount>({});
  const [columns, setColumns] = useState<FilteredColumns>({
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "consumer", "section", "name"],
      type: DataIndexType.STRING_CONSUMER_SECTION,
    },
    accountCode: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "code"],
      type: DataIndexType.MULTI,
    },
    accountName: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "name"],
      type: DataIndexType.MULTI,
    },
    amount: {
      label: "Дансны эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: "amount",
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Авлага үүссэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedBy",
      type: DataIndexType.USER,
    },
  });
  const getData = async (params: IParamBalanceAccount) => {
    await balanceAccountService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
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
                  key: key,
                  state: state,
                  column: columns,
                  onColumn: (columns) => setColumns(columns),
                  params: newParams,
                  onParams: (params) => setNewParams(params),
                });
                getData(newParams);
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
                    params: newParams,
                    onParams: (params) => setNewParams(params),
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
              x: 1400,
            }}
            rowKey="id"
            data={data}
            meta={meta}
            columns={columns}
            onChange={(params) => getData(params)}
            onColumns={(columns) => setColumns(columns)}
            newParams={newParams}
            onParams={(params) => setNewParams(params)}
            incomeFilters={filters}
            onEdit={(row) => console.log(row)}
            onDelete={(id) => console.log(id)}
          />
        </Col>
      </Row>
    </div>
  );
};
export default DescriptionList;
