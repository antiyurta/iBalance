"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
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
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataLimitOfLoans) => void;
  onDelete: (id: number) => void;
}
const key = "customer/limit-of-loans/customer-list";
const CustomerList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [data, setData] = useState<IDataLimitOfLoans[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
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
      type: DataIndexType.STRING_SECTION,
    },
    isAccount: {
      label: "Дансаар тохируулсан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isAccount"],
      type: DataIndexType.BOOLEAN,
    },
    limitAmount: {
      label: "Харилцагчид олгох нийт лимит",
      isView: true,
      isFiltered: false,
      dataIndex: ["limitAmount"],
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Захиалга хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isClose"],
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
      dataIndex: ["updatedAt"],
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
  const getData = async () => {
    blockContext.block();
    const params: IParamLimitOfLoans = { ...param };
    await limitOfLoansService
      .get(params)
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
    dispatch(newPane({ key, param: {} }));
    getConsumerSection(TreeSectionType.Consumer);
  }, []);
  useEffect(() => {
    getData();
  }, [param, onReload]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={sections}
            onClick={(sectionNames) => {
              dispatch(
                changeParam({
                  ...param,
                  filters: [
                    {
                      dataIndex: ["consumer", "section", "name"],
                      operator: "IN",
                      filter: sectionNames,
                    },
                  ],
                })
              );
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
                scroll={{
                  x: 1100,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onColumns={(columns) => setColumns(columns)}
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
