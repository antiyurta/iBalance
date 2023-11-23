import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getTransactionTranslate,
  onCloseFilterTag,
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
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import NewModal from "@/components/modal";
import TransactionConverter from "./local-transaction/converter/transaction-converter";
import TransactionAct from "./expense-transaction/act-transaction/transaction-act";
import TransactionCencus from "./local-transaction/census/transaction-cencus";
import TransactionMixture from "./local-transaction/mixture/transaction-mixture";
import TransactionAction from "./expense-transaction/action-transaction/transaction-action";
import TransactionMove from "./expense-transaction/warehouse-move-transaction/transaction-move";
import { TransactionPurchase } from "./income-transaction/material-income/transaction-purchase";
import TransactionRefundPurchase from "./expense-transaction/refund-purchase/transaction-refund-purchase";
import { TransactionSaleReturn } from "./income-transaction/sale-return/transaction-sale-return";
import TransactionSale from "./expense-transaction/sale-transaction/transaction-sale";
interface IProps {
  movingStatus?: MovingStatus;
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
  });
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<IDataDocument>();
  const [columns, setColumns] = useState<FilteredColumnsTransaction>(
    getTransactionColumns(movingStatus)
  );
  const getData = async (params: IParamTransaction) => {
    blockContext.block();
    if (movingStatus) params.movingStatus = movingStatus;
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
  const editDocument = async (transaction: IDataTransaction) => {
    blockContext.block();
    await DocumentService.getById(transaction.documentId)
      .then((response) => {
        if (response.success) {
          setIsOpenModal(true);
          setSelectedDocument(response.response);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getElement = (): JSX.Element => {
    switch (movingStatus) {
      case MovingStatus.ActAmortization:
        return (
          <TransactionAct
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Cencus:
        return (
          <TransactionCencus
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.InOperation:
        return (
          <TransactionAction
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.ItemConversion:
        return (
          <TransactionConverter
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Mixture:
        return (
          <TransactionMixture
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.MovementInWarehouse:
        return (
          <TransactionMove
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Purchase:
        return (
          <TransactionPurchase
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.PurchaseReturn:
        return (
          <TransactionRefundPurchase
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.SaleReturn:
        return (
          <TransactionSaleReturn
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Sales:
        return (
          <TransactionSale
            selectedDocument={selectedDocument}
            onSave={setIsOpenModal}
          />
        );
      default:
        return <></>;
    }
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
        title={getTransactionTranslate(movingStatus)}
        open={isOpenModal}
        footer={false}
        onCancel={() => setIsOpenModal(false)}
      >
        {getElement()}
      </NewModal>
    </div>
  );
};
