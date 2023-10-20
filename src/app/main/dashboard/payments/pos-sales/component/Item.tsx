import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { getFile } from "@/feature/common";

interface IProps {
  data: IDataShoppingCart;
}

const Item = (props: IProps) => {
  const {
    data: {
      id,
      quantity,
      material: { name, files },
    },
  } = props;
  const { setReload } = usePaymentGroupContext();
  const [url, setUrl] = useState<string>("");
  const blockContext: BlockView = useContext(BlockContext);
  const increase = async () => {
    await ShoppingCartService.patch(id, {
      quantity: quantity + 1,
    }).then((response) => {
      if (response.success) {
        blockContext.block();
        setReload(true);
      }
    });
  };
  const decrease = async () => {
    await ShoppingCartService.patch(id, {
      quantity: quantity - 1,
    }).then((response) => {
      if (response.success) {
        blockContext.block();
        setReload(true);
      }
    });
  };
  const remove = async () => {
    await ShoppingCartService.remove(id).then((response) => {
      if (response.success) {
        blockContext.block();
        setReload(true);
      }
    });
  };
  const getPhoto = async () => {
    await getFile(files[0].id).then((response) => {
      setUrl(response);
    });
  };
  useEffect(() => {
    if (files?.length > 0) {
      getPhoto();
    }
  }, [files]);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <Image src={url} width={50} height={50} alt={name} />
        <div
          style={{
            height: "100%",
            width: 1,
            background: "#DEE2E6",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {name}
          </p>
          <div>1</div>
          <div>1</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p>0.00%</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
          {quantity === 0 ? (
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => {
                remove();
              }}
              placement="left"
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{
                  maxHeight: 20,
                  maxWidth: 20,
                  padding: 2,
                }}
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          ) : (
            <Button
              style={{
                maxHeight: 20,
                maxWidth: 20,
                padding: 2,
              }}
              icon={<MinusOutlined />}
              onClick={decrease}
            />
          )}
          <p
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {quantity}
          </p>
          <Button
            style={{
              maxHeight: 20,
              maxWidth: 20,
              padding: 2,
            }}
            onClick={increase}
            icon={<PlusOutlined />}
          />
        </div>
      </div>
    </div>
  );
};
export default Item;
