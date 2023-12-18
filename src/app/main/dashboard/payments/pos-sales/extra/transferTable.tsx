import { Badge, Button, Table, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import NewModal from "@/components/modal";
import { MoneyTransactionService } from "@/service/pos/money-transaction/service";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { IDataMoneyTransaction } from "@/service/pos/money-transaction/entities";
import { Column } from "@/components/table";
import { IDataPos } from "@/service/pos/entities";
import { NumericFormat } from "react-number-format";
import { SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

const TransferModal = () => {
  const { posId } = useTypedSelector((state: RootState) => state.posOpenClose);
  const [data, setData] = useState<IDataMoneyTransaction[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const getMoneyTransaction = async () => {
    await MoneyTransactionService.get({ posId, isTransaction: true }).then(
      (response) => {
        if (response.success) {
          setData(response.response.data);
        }
      }
    );
  };
  const transfer = async (id: number) => {
    await MoneyTransactionService.transfer(id).then((response) => {
      if (response.success) {
        setIsOpenModal(false);
      }
    });
  };
  useEffect(() => {
    getMoneyTransaction();
  }, [isOpenModal]);
  return (
    <div>
      <Button
        type="text"
        style={{
          height: 48,
        }}
      >
        <Badge count={3}>
          <BellOutlined
            style={{
              color: "#198754",
              fontSize: 24,
            }}
            onClick={() => setIsOpenModal(true)}
          />
        </Badge>
      </Button>
      <NewModal
        title=" "
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
            }}
          >
            Мөнгө нэмэх, хасах, шилжүүлэг
          </Title>
          <Table dataSource={data} rowKey={"id"}>
            <Column
              dataIndex={"id"}
              title="№"
              render={(_, __, index) => index + 1}
            />
            <Column
              dataIndex={"pos"}
              title="Касс нэр / ID код"
              render={(value) => `${value.id} - ${value.name}`}
            />
            <Column
              dataIndex={"decreaseAmount"}
              title="Шилжүүлгийн дүн"
              render={(value) => (
                <NumericFormat
                  value={value}
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              )}
            />
            <Column
              dataIndex={"id"}
              title="Үйлдэл"
              render={(value) => (
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => transfer(value)}
                />
              )}
            />
          </Table>
        </div>
      </NewModal>
    </div>
  );
};
export default TransferModal;
