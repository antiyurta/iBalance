"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import Image from "next/image";
import { useEffect, useState } from "react";
import { limitOfLoansAccountService } from "@/service/limit-of-loans/account/service";
import {
  FilteredColumnsLimitOfLoansAccount,
  IDataLimitOfLoansAccount,
  Params,
} from "@/service/limit-of-loans/account/entities";
import { DataIndexType, IFilters, Meta } from "@/service/entities";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { NewTable } from "@/components/table";

const DescriptionList = () => {
  const [data, setData] = useState<IDataLimitOfLoansAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [newParams, setNewParams] = useState<Params>({});
  const [columns, setColumns] = useState<FilteredColumnsLimitOfLoansAccount>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "code"],
      type: DataIndexType.STRING_CONSUMER_CODE,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "name"],
      type: DataIndexType.STRING_CONSUMER_NAME,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "section", "name"],
      type: DataIndexType.STRING_CONSUMER_SECTION,
    },
    isAccount: {
      label: "Дансаар тохируулсан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "isAccount"],
      type: DataIndexType.BOOLEAN,
    },
    accountCode: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "code"],
      type: DataIndexType.STRING_ACCOUNT_CODE,
    },
    accountName: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "name"],
      type: DataIndexType.STRING,
    },
    amount: {
      label: "Зээлийн лимит /дансаарх/",
      isView: true,
      isFiltered: false,
      dataIndex: "amount",
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Захиалга хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "isClose"],
      type: DataIndexType.BOOLEAN,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
  });
  const getData = async (params: Params) => {
    await limitOfLoansAccountService.get(params).then((response) => {
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
      <div className="second-header">
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
        <div className="extra">
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
        </div>
      </div>
      <div className="body">
        <div
          style={{
            width: "100%",
          }}
        >
          <NewTable
            scroll={{
              x: 1700,
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
        </div>
      </div>
    </div>
  );
};
export default DescriptionList;
