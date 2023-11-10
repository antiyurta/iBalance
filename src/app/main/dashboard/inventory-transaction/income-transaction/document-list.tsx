import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsDocument,
  IDataDocument,
  IFilterDocument,
  IParamDocument,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

export const DocumentList = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataDocument[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterDocument>();
  const [params, setParams] = useState<IParamDocument>({ page: 1, limit: 10 });
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumnsDocument>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
    warehouse: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    incomeQuantity: {
      label: "Орлогын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "incomeQuantity",
      type: DataIndexType.MULTI,
    },
    incomeCount: {
      label: "Орлогын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "incomeCount",
      type: DataIndexType.MULTI,
    },
    expenseQuantity: {
      label: "Зарлагын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "expenseQuantity",
      type: DataIndexType.MULTI,
    },
    consumer: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    isLock: {
      label: "Гүйлгээ түгжсэн эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isLock",
      type: DataIndexType.MULTI,
    },
    description: {
      label: "Гүйлгээ утга",
      isView: true,
      isFiltered: false,
      dataIndex: "description",
      type: DataIndexType.MULTI,
    },
  });
  const getData = async (params: IParamDocument) => {
    blockContext.block();
    await DocumentService.get(params)
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
  useEffect(() => {
    getData(params);
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={isFilterToggle ? 20 : 24}>
          <div className="information">
            <div className="second-header">
              <Filtered
                columns={columns}
                isActive={(key, state) => {
                  onCloseFilterTag({
                    key: key,
                    state: state,
                    column: columns,
                    onColumn: setColumns,
                    params: params,
                    onParams: setParams,
                  });
                  getData(params);
                }}
              />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
                      params,
                      onParams: (params) => setParams(params),
                      getData,
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
                <Image
                  onClick={() => setIsFilterToggle(!isFilterToggle)}
                  src={
                    isFilterToggle
                      ? "/images/filterTrue.svg"
                      : "/images/filterFalse.svg"
                  }
                  width={24}
                  height={24}
                  alt="filter"
                />
              </div>
            </div>
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
              isDelete
              onEdit={(row) => {}}
              onDelete={(id) => {}}
            />
          </div>
        </Col>
        <Col span={isFilterToggle ? 4 : 0}>
          {/* <CommandFilterForm
            onToggle={() => setIsFilterToggle(!isFilterToggle)}
            getData={getData}
          /> */}
        </Col>
      </Row>
    </div>
  );
};
