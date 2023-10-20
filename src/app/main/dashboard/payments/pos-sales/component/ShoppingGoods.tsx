import NewModal from "@/components/modal";
import { AntTable } from "@/components/table";
import { Badge, Button, Popconfirm } from "antd";
import { SwapOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingGoodsService } from "@/service/pos/shopping-goods/service";
import { IDataShoppingGoods } from "@/service/pos/shopping-goods/entites";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
const ShoppingGoods = () => {
  const { isReload, setReload } = usePaymentGroupContext();
  const [data, setData] = useState<IDataShoppingGoods[]>([]);
  const [isOpenModalSave, setIsOpenModalSave] = useState<boolean>(false);
  const getShoppingGoods = async () => {
    await ShoppingGoodsService.get().then((response) => {
      if (response.success) {
        setData(response.response);
        setReload(false);
      }
    });
  };
  const transfer = async (id: number) => {
    await ShoppingGoodsService.patch(id).then((response) => {
      if (response.success) {
        setIsOpenModalSave(false);
        setReload(true);
      }
    });
  };
  const columns: ColumnsType<IDataShoppingGoods> = [
    {
      title: "№",
      dataIndex: "id",
      render: (text) => {
        return (
          <Button
            type="dashed"
            icon={<SwapOutlined />}
            onClick={() => transfer(text)}
          ></Button>
        );
      },
    },
    {
      title: "Тоо хэмжээ",
      dataIndex: "quantity",
      render: (text, row: IDataShoppingGoods) => {
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
              Бүтээгдэхүүний тоо: {row.materialQuantity}
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
              Тоо хэмжээ: {text}
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
    },
    {
      title: " ",
      dataIndex: "id",
      render: (text) => {
        return (
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => {
              ShoppingGoodsService.remove(text).then(() => {
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
