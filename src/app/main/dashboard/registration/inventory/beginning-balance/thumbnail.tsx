import Image from "next/image";
import { useContext, useEffect, useState } from "react";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { NewTable } from "@/components/table";
// interface  types
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { DataIndexType, Meta } from "@/service/entities";
//service
import { Col, Row, Space } from "antd";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import {
  FilteredColumnsBalance,
  IDataBalance,
  IFilterBalance,
  IParamBalance,
} from "@/service/material/balance/entities";
import { balanceService } from "@/service/material/balance/service";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataBalance) => void;
  onDelete: (id: number) => void;
}

const Thumbnail = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [newParams, setNewParams] = useState<IParamBalance>({
    page: 1,
    limit: 10,
  });
  const [data, setData] = useState<IDataBalance[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBalance>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsBalance>({
    materialCode: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "code"],
      type: DataIndexType.MULTI,
    },
    materialName: {
      label: "Бараа материалын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "name"],
      type: DataIndexType.MULTI,
    },
    materialSectionId: {
      label: "Бараа материалын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "section", "name"],
      type: DataIndexType.MULTI,
    },
    materialMeasurementId: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "measurement", "name"],
      type: DataIndexType.MEASUREMENT,
    },
    materialCountPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "countPackage"],
      type: DataIndexType.NUMBER,
    },
    quantity: {
      label: "Эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["quantity"],
      type: DataIndexType.NUMBER,
    },
  });
  const getData = async (params: IParamBalance) => {
    blockContext.block();
    await balanceService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
    blockContext.unblock();
  };
  const getConsumerSection = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      setSections(response.response);
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getConsumerSection(TreeSectionType.Consumer);
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
            extra="HALF"
            data={sections}
            isLeaf={true}
            onClick={(key, isLeaf) => {
              if (isLeaf) {
                // getData({
                //   page: 1,
                //   limit: 10,
                //   sectionId: [`${key}`],
                // });
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
export default Thumbnail;
