import React from "react";
import NewModal from "@/components/modal";
import { IDataDocument, MovingStatus } from "@/service/document/entities";
import { useEffect, useState } from "react";
import TransactionAct from "./expense-transaction/act-transaction/transaction-act";
import TransactionCencus from "./local-transaction/census/transaction-cencus";
import TransactionAction from "./expense-transaction/action-transaction/transaction-action";
import TransactionConverter from "./local-transaction/converter/transaction-converter";
import TransactionMixture from "./local-transaction/mixture/transaction-mixture";
import { TransactionPurchase } from "./income-transaction/material-income/transaction-purchase";
import TransactionRefundPurchase from "./expense-transaction/refund-purchase/transaction-refund-purchase";
import { TransactionSaleReturn } from "./income-transaction/sale-return/transaction-sale-return";
import TransactionSale from "./expense-transaction/sale-transaction/transaction-sale";
import TransactionMove from "./local-transaction/warehouse-move-transaction/transaction-move";
type Props = {
  movingStatus?: MovingStatus;
  selectedDocuments: IDataDocument[];
  isReload: boolean;
  setIsReload: (isReload: boolean) => void;
};
const DocumentEdit: React.FC<Props> = ({
  movingStatus,
  selectedDocuments = [],
  isReload,
  setIsReload,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const getElement = (): React.ReactNode => {
    switch (movingStatus) {
      case MovingStatus.ActAmortization:
        return (
          <TransactionAct
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Cencus:
        return (
          <TransactionCencus
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.InOperation:
        return (
          <TransactionAction
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.ItemConversion:
        return (
          <TransactionConverter
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Mixture:
        return (
          <TransactionMixture
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Purchase:
        return (
          <TransactionPurchase
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.PurchaseReturn:
        return (
          <TransactionRefundPurchase
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.SaleReturn:
        return (
          <TransactionSaleReturn
            selectedDocument={selectedDocuments[0]}
            onSave={setIsOpenModal}
          />
        );
      case MovingStatus.Sales:
        return (
          <TransactionSale
            selectedDocument={selectedDocuments[0]}
            onSave={(value) => {
              setIsOpenModal(value);
              setIsReload(!isReload);
            }}
          />
        );
      case MovingStatus.MovementInWarehouse:
        return <TransactionMove selectedDocuments={selectedDocuments} />;
      default:
        return <></>;
    }
  };
  useEffect(() => {
    setIsOpenModal(selectedDocuments.length > 0 ? true : false);
  }, [selectedDocuments]);
  return (
    <NewModal
      width={1500}
      title={""}
      open={isOpenModal}
      footer={false}
      onCancel={() => setIsOpenModal(false)}
    >
      {getElement()}
    </NewModal>
  );
};
export default DocumentEdit;
