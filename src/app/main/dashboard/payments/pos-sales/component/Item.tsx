import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { getFile } from "@/feature/common";
import { NumericFormat } from "react-number-format";

interface IProps {
  data: IDataShoppingCart;
}

const Item = (props: IProps) => {
  const {
    data: {
      id,
      amount,
      quantity,
      coupon,
      discount,
      material: { section, name, files },
      unitAmount,
    },
  } = props;
  const { setReload } = usePaymentGroupContext();
  const [inputValue, setInputValue] = useState<number>(quantity);
  const [url, setUrl] = useState<string>("");
  const blockContext: BlockView = useContext(BlockContext);
  const manualInput = async (number: number) => {
    setInputValue(number);
    await ShoppingCartService.patch(id, {
      quantity: number,
    }).finally(() => {
      blockContext.block();
      setReload(true);
    });
  };
  const increase = async () => {
    await ShoppingCartService.patch(id, {
      quantity: quantity + 1,
    })
      .then((response) => {
        setInputValue(response.response.quantity);
      })
      .finally(() => {
        blockContext.block();
        setReload(true);
      });
  };
  const decrease = async () => {
    await ShoppingCartService.patch(id, {
      quantity: quantity - 1,
    })
      .then((response) => {
        setInputValue(response.response.quantity);
      })
      .finally(() => {
        blockContext.block();
        setReload(true);
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
    } else {
      setUrl("/images/emptyMarket.png");
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
        <div
          style={{
            position: "relative",
            maxWidth: 50,
            maxHeight: 50,
          }}
        >
          {url ? <Image src={url} width={50} height={50} alt={name} /> : null}
          {discount ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "flex",
                background: "red",
                padding: "7px 4px",
                height: 28,
                borderRadius: 6,
              }}
            >
              {discount.amount > 0 ? (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "white",
                  }}
                >
                  {discount.amount}₮
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "white",
                  }}
                >
                  {discount.percent}%
                </p>
              )}
            </div>
          ) : null}
          {coupon ? (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                display: "flex",
                background: "#ffc107",
                padding: "7px 4px",
                height: 28,
                borderRadius: 6,
              }}
            >
              {coupon.percent > 0 ? (
                <>{coupon.conditionValue + "+" + coupon.percent + "%"}</>
              ) : (
                <>{coupon.conditionValue + "+" + coupon.quantity}</>
              )}
            </div>
          ) : null}
        </div>
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
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "start",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {name}
          </p>
          <div>{section?.name}</div>
          <p
            className={
              discount || coupon?.conditionValue < quantity
                ? "text-line-through"
                : ""
            }
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "start",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Үндсэн үнэ :{" "}
            <NumericFormat
              value={unitAmount}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              suffix="₮"
            />
          </p>
        </div>
      </div>
      <div
        style={{
          alignSelf: "end",
        }}
      >
        {discount ? (
          <p
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "start",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Хямдарсан үнэ:{" "}
            <NumericFormat
              value={unitAmount * quantity - amount}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              suffix="₮"
            />
          </p>
        ) : null}
        {coupon?.conditionValue < quantity ? (
          <p
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "start",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Хямдарсан үнэ:{" "}
            <NumericFormat
              value={amount / quantity}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              suffix="₮"
            />
          </p>
        ) : null}
      </div>
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
            fontSize: 14,
            fontWeight: 500,
            textAlign: "end",
          }}
        >
          <NumericFormat
            value={amount}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            displayType="text"
            suffix="₮"
          />
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            alignSelf: "flex-end",
          }}
        >
          {quantity < 2 ? (
            <Popconfirm
              title="Барааг устгах"
              description="Та энэ барааг устгахдаа итгэлттэй байна уу?"
              onConfirm={() => {
                remove();
              }}
              placement="top"
              okText="Тийм"
              cancelText="Үгүй"
            >
              <Button
                style={{
                  maxHeight: 20,
                  maxWidth: 20,
                  padding: 2,
                  background: "red",
                }}
                danger
                icon={
                  <DeleteOutlined
                    style={{
                      color: "white",
                    }}
                  />
                }
              />
            </Popconfirm>
          ) : (
            <Button
              style={{
                maxHeight: 20,
                maxWidth: 20,
                padding: 2,
                background: "#E5E6EB",
                border: "1px solid #E5E6EB",
              }}
              icon={
                <MinusOutlined
                  style={{
                    color: "black",
                  }}
                />
              }
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
            {/* <NumericFormat
              ref={inputRef}
              value={inputValue}
              inputMode="numeric"
              onFocus={(e) => {
                console.log(e.currentTarget, inputValue.toString().length);
                e.currentTarget.setSelectionRange(
                  inputValue.toString().length,
                  inputValue.toString().length
                );
              }}
              onChange={(e) => manualInput(Number(e.target.value))}
              style={{
                // textAlign: "end",
                maxWidth: 50,
                borderRadius: 5,
                border: "1px solid green",
              }}
            /> */}
            <input
              value={inputValue}
              type="number"
              maxLength={3}
              pattern="[0-9]"
              onChange={(e) => manualInput(Number(e.target.value))}
              style={{
                textAlign: "end",
                maxWidth: 50,
                borderRadius: 5,
                border: "1px solid green",
              }}
            />
          </p>
          <Button
            style={{
              maxHeight: 20,
              maxWidth: 20,
              padding: 2,
              background: "green",
            }}
            onClick={increase}
            icon={
              <PlusOutlined
                style={{
                  color: "white",
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
export default Item;
