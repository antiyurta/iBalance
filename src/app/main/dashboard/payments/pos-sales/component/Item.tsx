import Image from "next/image";
import React from "react";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { IGoods } from "@/service/pos/entities";
import {
  removeGoods,
  saveGoods,
} from "@/feature/store/slice/point-of-sale/goods.slice";

interface IProps {
  data: IGoods;
}

const Item = (props: IProps) => {
  const { data } = props;
  const dispatch = useDispatch<AppDispatch>();
  const onChange = (quantity: number) => {
    dispatch(
      saveGoods({
        ...data,
        quantity,
        payAmount: quantity * (data.unitAmount - data.discountAmount),
      })
    );
  };
  const manual = (value: 1 | -1) => {
    const quantity = data.quantity + value;
    dispatch(
      saveGoods({ ...data, quantity, payAmount: quantity * data.unitAmount })
    );
  };
  const remove = async () => {
    dispatch(removeGoods(data.materialId));
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.15)",
        borderRadius: 5,
        padding: "6px 2px",
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
          <Image
            src={data.imageUrl}
            width={50}
            height={50}
            alt={data.materialName}
          />
          {/* {discountAmount !== unitAmount ? (
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
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "white",
                }}
              >
                {discountName}
              </p>
            </div>
          ) : null} */}
          {/* TODO {coupon ? (
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
          ) : null} */}
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
            justifyContent: "space-between",
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
            {data.materialName}
          </p>
          <div>{data.sectionName}</div>

          <div
            style={{
              margin: 0,
              color: "#142A38",
              textAlign: "start",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {/* className nemeh coupon?.conditionValue < quantity */}
            Үндсэн үнэ :{" "}
            <NumericFormat
              value={data.unitAmount}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              suffix="₮"
            />
          </div>
        </div>
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
            value={data.payAmount}
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
          {data.quantity < 2 ? (
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
              onClick={() => manual(-1)}
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
            <input
              value={data.quantity}
              type="number"
              maxLength={3}
              pattern="[0-9]"
              onChange={(e) => onChange(Number(e.target.value))}
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
            onClick={() => manual(1)}
            icon={
              <PlusOutlined
                style={{
                  color: "white",
                }}
              />
            }
          />
        </div>
        <div
          style={{
            alignSelf: "end",
          }}
        >
          {/* {discount ? (
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
                // value={unitAmount * quantity - amount}
                value={amount / quantity}
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
          ) : null} TODO */}
        </div>
      </div>
    </div>
  );
};
export default Item;
