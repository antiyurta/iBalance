import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsWarehouseDocument,
  IDataWarehouseDocument,
  IFilterWarehouseDocument,
  IParamWarehouseDocument,
} from "@/service/document/warehouse-document/entities";
import { WarehouseDocumentService } from "@/service/document/warehouse-document/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import LockDocument from "../../lock-document";
import { MovingStatus } from "@/service/document/entities";
import { NewTable } from "@/components/table";
import NewModal from "@/components/modal";
import TransactionMove from "./transaction-move";

export const WarehouseDocumentList = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataWarehouseDocument[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterWarehouseDocument>();
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] =
    useState<IDataWarehouseDocument>();
  const [columns, setColumns] = useState<FilteredColumnsWarehouseDocument>({
    code: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    documentAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["documentAt"],
      type: DataIndexType.DATE,
    },
    description: {
      label: "Гүйлгээний утга",
      isView: true,
      isFiltered: false,
      dataIndex: ["description"],
      type: DataIndexType.MULTI,
    },
    expenseWarehouseId: {
      label: "Зарлага гаргах байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["expenseWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    expenseEmployeeId: {
      label: "Зарлага гаргах нярав",
      isView: true,
      isFiltered: false,
      dataIndex: ["expenseEmployee", "firstName"],
      type: DataIndexType.MULTI,
    },
    incomeWarehouseId: {
      label: "Орлого авах байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["incomeWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    incomeEmployeeId: {
      label: "Орлого авах нярав",
      isView: true,
      isFiltered: false,
      dataIndex: ["incomeEmployee", "firstName"],
      type: DataIndexType.MULTI,
    },
    counter: {
      label: "Шилжүүлсэн тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["counter"],
      type: DataIndexType.NUMBER,
    },
    quantity: {
      label: "Шилжүүлсэн тоо ширхэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["quantity"],
      type: DataIndexType.NUMBER,
    },
    updatedBy: {
      label: "Бүртгэсэн хэрэглэгч",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
    updatedAt: {
      label: "Бүртгэсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATETIME,
    },
  });

  const getData = async () => {
    blockContext.block();
    await WarehouseDocumentService.get()
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => blockContext.unblock());
  };

  const editDocument = async (row: IDataWarehouseDocument) => {
    // if (row.isLock) {
    //   openNofi('warning', 'Баримт түгжигдсэн байна.')
    // } else {
    setSelectedDocument(row);
    setIsEdit(true);
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await WarehouseDocumentService.remove(id)
      .then((response) => {
        if (response.success) {
          getData();
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={isFilterToggle ? 20 : 24}>
          <div className="information">
            <div className="second-header">
              <Filtered columns={columns} />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
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
                <LockDocument movingStatus={MovingStatus.MovementInWarehouse} />
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
              onColumns={setColumns}
              incomeFilters={filters}
              isEdit
              isDelete={true}
              onEdit={editDocument}
              onDelete={onDelete}
            />
          </div>
        </Col>
        <Col span={isFilterToggle ? 4 : 0}>
        </Col>
      </Row>
      <NewModal
        width={1500}
        title={""}
        open={isEdit}
        footer={false}
        onCancel={() => setIsEdit(false)}
      >
        <TransactionMove
          selectedDocument={selectedDocument}
          onSave={setIsEdit}
        />
      </NewModal>
    </div>
  );
};
