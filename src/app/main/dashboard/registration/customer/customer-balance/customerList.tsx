"use client";

import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import { DataIndexType, Meta } from "@/service/entities";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { NewTable } from "@/components/table";
import { Col, Row, Space } from "antd";
import { initialBalanceService } from "@/service/consumer/initial-balance/service";
import {
  FilteredColumnsInitialBalance,
  IDataInitialBalance,
  IFilterInitialBalance,
  IParamInitialBalance,
} from "@/service/consumer/initial-balance/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataInitialBalance) => void;
  onDelete: (id: number) => void;
}
const key = "customer/balance/customer-list";
const CustomerList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IDataInitialBalance[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterInitialBalance>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsInitialBalance>({
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
    consumerSectionId: {
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
      dataIndex: ["amount"],
      type: DataIndexType.VALUE,
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
    const params: IParamInitialBalance = { ...param };
    await initialBalanceService
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
  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getSections(TreeSectionType.Consumer);
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
                  x: 1000,
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
