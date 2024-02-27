import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useContext, useEffect, useState } from "react";
import { IDataCoupon } from "@/service/command/coupon/entities";
import { IDataDiscount } from "@/service/command/discount/entities";
import { getFile } from "@/feature/common";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { NumericFormat } from "react-number-format";
import { displayCoupon, checkCoupon } from "../injection";
import { Coupon } from "./coupon";
import { Operator } from "@/service/entities";
import { DisplayType } from "./tool-header/display-tool";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { saveGoods } from "@/feature/store/slice/point-of-sale/goods.slice";
import { useTypedSelector } from "@/feature/store/reducer";
import { IGoods } from "@/service/pos/entities";

interface IProps {
  type: DisplayType;
  material: IDataViewMaterial;
}

interface IDisplayItem {
  id: number;
  name: string;
  code: string;
  sectionName: string;
  src: string;
  coupon: IDataCoupon;
  discountName: string;
  discountAmount: number;
  unitAmount: number;
  lastQty: number;
}

const DisplayItem = (props: IProps) => {
  const { type, material } = props;
  const dispatch = useDispatch<AppDispatch>();
  const goods = useTypedSelector((state) => state.shoppingGoods);
  const { isReload, setReload } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [item, setItem] = useState<IDisplayItem>();

  const GetNewAmount = (props: { item: IDisplayItem }) => {
    const { item } = props;
    var amount: number = 0;
    if (item.discountAmount > 0) {
      amount = item.unitAmount - item.discountAmount;
    }
    if (item.coupon) {
      amount = checkCoupon({
        unitAmount: item.unitAmount,
        conditionValue: item.coupon.conditionValue,
        percent: item.coupon.percent,
        quantity: item.coupon.quantity,
      });
    }
    if (amount > 0) {
      return (
        <p
          style={{
            fontWeight: 600,
            color: "red",
          }}
        >
          <NumericFormat
            value={amount}
            thousandSeparator=","
            fixedDecimalScale
            displayType="text"
            suffix="₮"
          />
        </p>
      );
    }
  };
  const onFinish = async (data: IDisplayItem) => {
    const currentIndex = goods.findIndex((item) => item.materialId == data.id);
    const currentGoods: IGoods = {
      materialId: data.id,
      materialName: data.name,
      imageUrl: data.src,
      sectionName: data.sectionName,
      unitAmount: data.unitAmount,
      quantity: 1,
      discountAmount: 0,
      payAmount: data.unitAmount,
      totalAmount: data.unitAmount,
    };
    if (currentIndex !== -1) {
      currentGoods.quantity = goods[currentIndex].quantity + 1;
      currentGoods.payAmount =
        goods[currentIndex].unitAmount * (goods[currentIndex].quantity + 1);
    }
    dispatch(saveGoods(currentGoods));
  };
  const configureData = async () => {
    setItem({
      id: material.id,
      name: material.name,
      code: material.code,
      sectionName: material.sectionName,
      src:
        material.fileId != null
          ? await getFile(material.fileId)
          : "/images/emptyMarket.png",
      coupon: material.coupon,
      discountName: material.discountName,
      discountAmount: material.discountAmount,
      unitAmount: material.unitAmount,
      lastQty: material.lastQty,
    });
  };
  useEffect(() => {
    configureData();
  }, [material]);
  return (
    <>
      {item ? (
        <div className={type === "grid" ? "item-group" : "item-list"}>
          <div className={type === "grid" ? "image" : "left"}>
            <Link href={"/main/dashboard/payments/pos-sales/" + item.id}>
              <Image
                src={item.src}
                width={type === "grid" ? 120 : 50}
                height={type === "grid" ? 120 : 50}
                alt={item.name}
              />
            </Link>
            {type === "list" ? (
              <div className="title">
                <p className="top">{item.name}</p>
                <p className="bottom">{item.code}</p>
                <div className="price">
                  <p className="p-top">{item.sectionName}</p>
                  <div className="p-bottom">
                    <p
                      className={
                        item.discountAmount > 0 || item.coupon
                          ? "text-line-through"
                          : ""
                      }
                    >
                      <NumericFormat
                        value={item.unitAmount}
                        thousandSeparator=","
                        fixedDecimalScale
                        displayType="text"
                        suffix="₮"
                      />
                    </p>
                    <GetNewAmount item={item} />
                  </div>
                </div>
              </div>
            ) : null}
            {type === "grid" ? (
              <>
                {item.coupon ? (
                  <div className="extra-bottom">
                    <Coupon
                      condition={item.coupon.condition}
                      conditionValue={item.coupon.conditionValue}
                      quantity={item.coupon.quantity}
                      percent={item.coupon.percent}
                    />
                  </div>
                ) : null}
                {item.discountAmount > 0 ? (
                  <div className="extra-top">
                    <p>{item.discountName}</p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
          {type === "list" ? (
            <div className="right">
              {item.coupon || item.discountAmount > 0 ? (
                <div className="extra">
                  {item.coupon ? (
                    <Coupon
                      condition={item.coupon.condition}
                      conditionValue={item.coupon.conditionValue}
                      quantity={item.coupon.quantity}
                      percent={item.coupon.percent}
                    />
                  ) : null}
                  <div className="discount">
                    <p>{item.discountName}</p>
                  </div>
                </div>
              ) : null}
              <Button
                style={{
                  width: "100%",
                }}
                onClick={() => onFinish(item)}
                icon={<ShoppingCartOutlined />}
              >
                Сагслах
              </Button>
            </div>
          ) : null}
          {type === "grid" ? (
            <>
              <div className="title">
                <p className="top">{item?.name}</p>
                <p className="bottom">{item?.code}</p>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 1,
                  background: "#DEE2E6",
                }}
              />
              <div className="price">
                <p className="top">{item.sectionName}</p>
                <div className="bottom">
                  <p
                    className={
                      item.discountAmount > 0 || item.coupon
                        ? "text-line-through"
                        : ""
                    }
                  >
                    <NumericFormat
                      value={item.unitAmount}
                      thousandSeparator=","
                      fixedDecimalScale
                      displayType="text"
                      suffix="₮"
                    />
                  </p>
                  <GetNewAmount item={item} />
                </div>
              </div>
              <Button
                style={{
                  width: "100%",
                }}
                icon={<ShoppingCartOutlined />}
                onClick={() => onFinish(item)}
              >
                Сагслах
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
export default DisplayItem;
