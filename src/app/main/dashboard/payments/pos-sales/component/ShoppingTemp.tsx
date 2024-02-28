import NewModal from "@/components/modal";
import { AntTable } from "@/components/table";
import { Badge, Button, Popconfirm } from "antd";
import { SwapOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { NumericFormat } from "react-number-format";
import { ITemp } from "@/service/pos/entities";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { useTypedSelector } from "@/feature/store/reducer";
import { removeTemp } from "@/feature/store/slice/point-of-sale/temp.slice";
import { saveGoods } from "@/feature/store/slice/point-of-sale/goods.slice";
const ShoppingTemp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shoppingTemps = useTypedSelector((state) => state.shoppingTemp);
  const [isOpenModalSave, setIsOpenModalSave] = useState<boolean>(false);
  const columns: ColumnsType<ITemp> = [
    {
      title: "№",
      dataIndex: "id",
      render: (_, __, index) => {
        return (
          <Button
            type="dashed"
            icon={<SwapOutlined />}
            onClick={() => {
              shoppingTemps[index].goods.map((item) => {
                dispatch(saveGoods(item));
              });
              dispatch(removeTemp(index));
            }}
          ></Button>
        );
      },
    },
    {
      title: "Тоо хэмжээ",
      render: (row: ITemp) => {
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
      render: (_, __, index) => {
        return (
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => dispatch(removeTemp(index))}
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
  return (
    <div>
      <button
        className="app-button-regular"
        style={{
          height: 38,
        }}
        onClick={() => setIsOpenModalSave(true)}
      >
        <Badge count={shoppingTemps.length}>
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
          dataSource={shoppingTemps}
        />
      </NewModal>
    </div>
  );
};
export default ShoppingTemp;
