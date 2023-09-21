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
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { DataIndexType, IFilters, Meta } from "@/service/entities";
import {
  FilteredColumnsLimitOfLoans,
  IDataLimitOfLoans,
  IParamLimitOfLoans,
} from "@/service/limit-of-loans/entities";
//service
import { limitOfLoansService } from "@/service/limit-of-loans/service";
import { Col, Row, Space } from "antd";
import { TreeSectionService } from "@/service/reference/tree-section/service";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataLimitOfLoans) => void;
  onDelete: (id: number) => void;
}

const CustomerList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [params, setParams] = useState<IParamLimitOfLoans>({});
  const [data, setData] = useState<IDataLimitOfLoans[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
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
      type: DataIndexType.USER,
    },
  });
  const getData = async (param: IParamLimitOfLoans) => {
    blockContext.block();
    var prm: IParamLimitOfLoans = {
      ...param,
      ...params,
      queries: params.queries,
    };
    if (param.queries?.length) {
      const incomeParam = param.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, params), ...param.queries];
    }
    if (param.code) {
      prm.queries = [...unDuplicate("code", params)];
    }
    if (param.name) {
      prm.queries = [...unDuplicate("name", params)];
    }
    if (param.sectionId) {
      prm.queries = [...unDuplicate("sectionId", params)];
    }
    if (param.isAccount) {
      prm.queries = [...unDuplicate("isAccount", params)];
    }
    if (param.limitAmount) {
      prm.queries = [...unDuplicate("limitAmount", params)];
    }
    if (param.isClose) {
      prm.queries = [...unDuplicate("isClose", params)];
    }
    if (param.isActive) {
      prm.queries = [...unDuplicate("isActive", params)];
    }
    if (param.updatedAt) {
      prm.queries = [...unDuplicate("updatedAt", params)];
    }
    if (param.updatedBy) {
      prm.queries = [...unDuplicate("updatedBy", params)];
    }
    setParams(prm);
    await limitOfLoansService
      .get(prm)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getConsumerSection = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      setSections(response.response);
    });
  };
  useEffect(() => {
    getConsumerSection(TreeSectionType.Consumer);
  }, []);
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, [onReload]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            mode="CONSUMER"
            extra="HALF"
            data={sections}
            isLeaf={true}
            onClick={(key, isLeaf) => {
              if (isLeaf) {
                getData({
                  page: 1,
                  limit: 10,
                  sectionId: [key],
                });
              }
            }}
          />
        </Col>
        <Col md={24} lg={14} xl={18}>
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
                scroll={{
                  x: 1700,
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
                isEdit={true}
                onEdit={(row) => onEdit(row)}
                isDelete={true}
                onDelete={(id) => onDelete(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default CustomerList;
