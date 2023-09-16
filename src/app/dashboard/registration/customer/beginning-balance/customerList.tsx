"use client";

import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  FilteredColumnsLimitOfLoans,
  IDataLimitOfLoans,
} from "@/service/limit-of-loans/entities";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  unDuplicate,
} from "@/feature/common";

import { limitOfLoansService } from "@/service/limit-of-loans/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { NewTable } from "@/components/table";
import { Col, Row, Space } from "antd";
import { initialBalanceService } from "@/service/beginning-balance/service";
import {
  IDataInitialBalance,
  Params,
} from "@/service/beginning-balance/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataInitialBalance) => void;
  onDelete: (id: number) => void;
}

const CustomerList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [newParams, setNewParams] = useState<Params>({});
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [data, setData] = useState<IDataInitialBalance[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [filters, setFilters] = useState<IFilters>();
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [columns, setColumns] = useState<FilteredColumns>({
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
      type: DataIndexType.STRING_SECTION,
    },
    amount: {
      label: "Эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: "amount",
      type: DataIndexType.VALUE,
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
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const openModal = (state: boolean, row?: IDataLimitOfLoans) => {
    // setIsMode(state);
    // if (!state) {
    //   form.resetFields();
    // } else {
    //   form.setFieldsValue(row);
    // }
    // setIsOpenModal(true);
    setSelectedRow(row);
  };
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
      amount: params.amount || newParams.amount,
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
    if (params.amount) {
      prm.queries = [...unDuplicate("amount", newParams)];
    }
    if (params.updatedAt) {
      prm.queries = [...unDuplicate("updatedAt", newParams)];
    }
    if (params.updatedBy) {
      prm.queries = [...unDuplicate("updatedBy", newParams)];
    }
    setNewParams(prm);
    await initialBalanceService
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
  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getSections(TreeSectionType.Consumer);
  }, []);
  useEffect(() => {
    if (onReload) {
      getData({ page: 1, limit: 10 });
    }
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
            onClick={(key) => {
              getData({ page: 1, limit: 10, sectionId: [`${key}`] });
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
                  x: 1000,
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
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default CustomerList;
