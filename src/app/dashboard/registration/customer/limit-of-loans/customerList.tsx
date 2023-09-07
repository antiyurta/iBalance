"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  unDuplicate,
} from "@/feature/common";
import { NewTable } from "@/components/table";
// interface  types
import { TreeSectionType } from "@/service/consumer/section/entities";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsLimitOfLoans,
  IDataLimitOfLoans,
  IFilters,
  Params,
} from "@/service/limit-of-loans/entities";
//service
import { limitOfLoansService } from "@/service/limit-of-loans/service";

interface IProps {
  onEdit: (row: IDataLimitOfLoans) => void;
  onDelete: (id: number) => void;
}

const CustomerList = (props: IProps) => {
  const { onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [newParams, setNewParams] = useState<Params>({});
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [data, setData] = useState<IDataLimitOfLoans[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [tableWidth, setTableWidth] = useState<string>("calc(100% - 262px)");
  const [columns, setColumns] = useState<FilteredColumnsLimitOfLoans>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "section", "name"],
      type: DataIndexType.STRING_CONSUMER_SECTION,
    },
    isAccount: {
      label: "Дансаар тохируулсан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isAccount",
      type: DataIndexType.BOOLEAN,
    },
    limitAmount: {
      label: "Харилцагчид олгох нийт лимит",
      isView: true,
      isFiltered: false,
      dataIndex: "limitAmount",
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Захиалга хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isClose",
      type: DataIndexType.BOOLEAN,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "isActive"],
      type: DataIndexType.BOOLEAN_STRING,
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
      type: DataIndexType.STRING,
    },
  });
  const getData = async (params: Params) => {
    blockContext.block();
    var prm: Params = {
      page: params.page || newParams.page,
      limit: params.limit || newParams.limit,
      orderParam: params.orderParam || newParams.orderParam,
      order: params.order || newParams.order,
      code: params.code || newParams.code,
      name: params.name || newParams.name,
      sectionId: params.sectionId || newParams.sectionId,
      isAccount: params.isAccount || newParams.isAccount,
      limitAmount: params.limitAmount || newParams.limitAmount,
      isClose: params.isClose || newParams.isClose,
      isActive: params.isActive || newParams.isActive,
      updatedAt: params.updatedAt || newParams.updatedAt,
      updatedBy: params.updatedBy || newParams.updatedBy,
      queries: newParams.queries,
    };
    if (params.queries?.length) {
      const incomeParam = params.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, newParams), ...params.queries];
    }
    if (params.code) {
      prm.queries = [...unDuplicate("code", newParams)];
    }
    if (params.name) {
      prm.queries = [...unDuplicate("name", newParams)];
    }
    if (params.sectionId) {
      prm.queries = [...unDuplicate("sectionId", newParams)];
    }
    if (params.isAccount) {
      prm.queries = [...unDuplicate("isAccount", newParams)];
    }
    if (params.limitAmount) {
      prm.queries = [...unDuplicate("limitAmount", newParams)];
    }
    if (params.isClose) {
      prm.queries = [...unDuplicate("isClose", newParams)];
    }
    if (params.isActive) {
      prm.queries = [...unDuplicate("isActive", newParams)];
    }
    if (params.updatedAt) {
      prm.queries = [...unDuplicate("updatedAt", newParams)];
    }
    if (params.updatedBy) {
      prm.queries = [...unDuplicate("updatedBy", newParams)];
    }
    setNewParams(prm);
    await limitOfLoansService.get(prm).then((response) => {
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
        <NewDirectoryTree
          isLeaf={true}
          type={TreeSectionType.Consumer}
          open={isOpenTree}
          onClick={(key) => {
            getData({ page: 1, limit: 10, sectionId: [`${key}`] });
          }}
        />
        <div
          style={{
            width: tableWidth,
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
            onEdit={(row) => onEdit(row)}
            onDelete={(id) => onDelete(id)}
          />
        </div>
      </div>
    </div>
  );
};
export default CustomerList;
