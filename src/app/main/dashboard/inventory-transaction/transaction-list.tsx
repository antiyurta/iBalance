import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsTransaction,
  IDataTransaction,
  IFilterTransaction,
  IParamTransaction,
} from "@/service/document/transaction/entities";
import { TransactionService } from "@/service/document/transaction/service";
import { Col, Row } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MovingStatus } from "@/service/document/entities";
interface IProps {
  movingStatus: MovingStatus;
}
export const TransactionList = (props: IProps) => {
  const { movingStatus } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataTransaction[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterTransaction>();
  const [params, setParams] = useState<IParamTransaction>({
    page: 1,
    limit: 10,
    movingStatus,
  });
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumnsTransaction>({
    documentId: {
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
      dataIndex: ["document", "warehouse", "name"],
      type: DataIndexType.MULTI,
    },
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
    quantity: {
      label: "Орлогын тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "quantity",
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    description: {
      label: "Гүйлгээний утга",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "description"],
      type: DataIndexType.MULTI,
    },
    sectionName: {
      label: "Гүйлгээний төрөл",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "section", "name"],
      type: DataIndexType.MULTI,
    },
    endAt: {
      label: "Дуусах хугацаа",
      isView: true,
      isFiltered: false,
      dataIndex: ["document", "endAt"],
      type: DataIndexType.MULTI,
    },
  });
  const getData = async (params: IParamTransaction) => {
    blockContext.block();
    await TransactionService.get(params)
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
