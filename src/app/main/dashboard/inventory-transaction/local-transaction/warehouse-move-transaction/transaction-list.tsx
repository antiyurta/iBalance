import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { Meta } from "@/service/entities";
import {
  FilteredColumnsTransaction,
  IDataTransaction,
  IFilterTransaction,
  IParamTransaction,
  getTransactionColumns,
} from "@/service/document/transaction/entities";
import { TransactionService } from "@/service/document/transaction/service";
import { Col, Row } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MovingStatus } from "@/service/document/entities";
import { IDataWarehouseDocument } from "@/service/document/warehouse-document/entities";
import { WarehouseDocumentService } from "@/service/document/warehouse-document/service";
import NewModal from "@/components/modal";
import TransactionMove from "./transaction-move";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";
interface IProps {
  movingStatus?: MovingStatus;
}
const key = "local-transaction/warehouse-move-transaction";
export const TransactionWarehouseList = (props: IProps) => {
  const { movingStatus } = props;
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataTransaction[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterTransaction>();
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] =
    useState<IDataWarehouseDocument>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumnsTransaction>(
    getTransactionColumns(movingStatus)
  );
  const getData = async () => {
    const params: IParamTransaction = {
      ...param,
    };
    blockContext.block();
    await TransactionService.get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const editDocument = async (transaction: IDataTransaction) => {
    if (transaction.document?.isLock) {
      openNofi("warning", "Баримт түгжигдсэн байна.");
    } else if (transaction.warehouseDocumentId) {
      blockContext.block();
      await WarehouseDocumentService.getById(transaction.warehouseDocumentId)
        .then((response) => {
          if (response.success) {
            setSelectedDocument(response.response);
            setIsOpenModal(true);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getData();
  }, [isOpenModal]);
  useEffect(() => {
    dispatch(
      newPane({
        key,
        param: {
          filters: movingStatus && [
            {
              dataIndex: ["document", "movingStatus"],
              operator: "EQUALS",
              filter: movingStatus,
            },
          ],
        },
      })
    );
  });
  useEffect(() => {
    getData();
  }, [param]);
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
              onEdit={editDocument}
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
      <NewModal
        width={1500}
        title={""}
        open={isOpenModal}
        footer={false}
        onCancel={() => setIsOpenModal(false)}
      >
        <TransactionMove
          selectedDocument={selectedDocument}
          onSave={setIsOpenModal}
        />
      </NewModal>
    </div>
  );
};
