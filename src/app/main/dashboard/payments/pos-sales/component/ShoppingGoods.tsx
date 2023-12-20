import NewModal from "@/components/modal";
import { AntTable } from "@/components/table";
import { Badge, Button, Popconfirm } from "antd";
import { SwapOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { IDataShoppingTemp } from "@/service/pos/shopping-card/temp/entities";
import { ShoppingTempService } from "@/service/pos/shopping-card/temp/service";
import { NumericFormat } from "react-number-format";
const ShoppingGoods = () => {
  const { isReload, setReload } = usePaymentGroupContext();
  const [data, setData] = useState<IDataShoppingTemp[]>([]);
  const [isOpenModalSave, setIsOpenModalSave] = useState<boolean>(false);
  const getShoppingGoods = async () => {
    await ShoppingTempService.get().then((response) => {
      if (response.success) {
        setData(response.response);
        setReload(false);
      }
    });
  };
  const columns: ColumnsType<IDataShoppingTemp> = [
    {
      title: "№",
      dataIndex: "id",
      render: (id: number) => {
        return (
          <Button
            type="dashed"
            icon={<SwapOutlined />}
            onClick={() =>
              ShoppingTempService.empty(id).then((response) => {
                if (response.success) {
                  setIsOpenModalSave(false);
                  setReload(true);
                }
              })
            }
          ></Button>
        );
      },
    },
    {
      title: "Тоо хэмжээ",
      render: (row: IDataShoppingTemp) => {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "self-start",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#142A38",
                textAlign: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Бүтээгдэхүүний тоо: {row.quantity}
            </p>
            <p
              style={{
                margin: 0,
                color: "#142A38",
                textAlign: "center",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              Тоо хэмжээ: {row.counter}
            </p>
          </div>
        );
      },
    },
    {
      title: "Огноо",
      dataIndex: "createdAt",
      render: (text: string) => {
        return dayjs(text).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      title: "Төлөх дүн",
      dataIndex: "payAmount",
      render: (text: string) => (
        <NumericFormat
          value={text}
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          displayType="text"
          suffix="₮"
        />
      ),
    },
    {
      title: " ",
      dataIndex: "id",
      render: (id: number) => {
        return (
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => {
              ShoppingTempService.remove(id).then(() => {
                getShoppingGoods();
              });
            }}
            placement="left"
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                padding: 0,
              }}
              type="text"
              icon={
                <CloseOutlined
                  style={{
                    fontSize: 24,
                    color: "red",
                  }}
                />
              }
            />
          </Popconfirm>
        );
      },
    },
  ];
  useEffect(() => {
    isReload && getShoppingGoods();
  }, [isReload]);
  useEffect(() => {
    getShoppingGoods();
  }, [isOpenModalSave]);
  return (
    <div>
      <button
        className="app-button-regular"
        style={{
          height: 38,
        }}
        onClick={() => setIsOpenModalSave(true)}
      >
        <Badge count={data.length}>
          <Image src="/images/save.png" width={24} height={24} alt="save" />
        </Badge>
      </button>
      <NewModal
        title="Түр хадгалах"
        open={isOpenModalSave}
        onCancel={() => setIsOpenModalSave(false)}
        footer={null}
      >
        <AntTable
          rowKey={"id"}
          bordered
          columns={columns}
          pagination={false}
          dataSource={data}
        />
      </NewModal>
    </div>
  );
};
export default ShoppingGoods;
