import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, getTransactionTranslate, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsDocument,
  IDataDocument,
  IFilterDocument,
  IParamDocument,
  MovingStatus,
  getDocumentColumns,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import TransactionAct from "./expense-transaction/act-transaction/transaction-act";
import TransactionCencus from "./local-transaction/census/transaction-cencus";
import TransactionAction from "./expense-transaction/action-transaction/transaction-action";
import TransactionConverter from "./local-transaction/converter/transaction-converter";
import TransactionMixture from "./local-transaction/mixture/transaction-mixture";
import TransactionMove from "./expense-transaction/warehouse-move-transaction/transaction-move";
import { TransactionPurchase } from "./income-transaction/material-income/transaction-purchase";
import TransactionRefundPurchase from "./expense-transaction/refund-purchase/transaction-refund-purchase";
import { TransactionSaleReturn } from "./income-transaction/sale-return/transaction-sale-return";
import TransactionSale from "./expense-transaction/sale-transaction/transaction-sale";
interface IProps {
  movingStatus?: MovingStatus;
  selectedDocument?: IDataDocument;
}
export const DocumentEdit = (props: IProps) => {
  const { movingStatus, selectedDocument } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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
    setIsOpenModal(selectedDocument ? true : false);
  }, [selectedDocument]);
  return (
    <NewModal
      width={1500}
      title={getTransactionTranslate(movingStatus)}
      open={isOpenModal}
      footer={false}
      onCancel={() => setIsOpenModal(false)}
    >
      {getElement()}
    </NewModal>
  );
};
