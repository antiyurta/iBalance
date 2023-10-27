import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { TypeSegment } from "../page";
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
import { IDataShoppingCartPost } from "@/service/pos/shopping-card/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";

interface IProps {
  type: TypeSegment;
  material: IDataViewMaterial;
}

interface IDisplayItem {
  id: number;
  name: string;
  code: string;
  sectionName: string;
  src: string;
  coupon: IDataCoupon;
  discount: IDataDiscount;
  unitAmount: number;
}

const DisplayItem = (props: IProps) => {
  const { type, material } = props;
  const { setReload } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [item, setItem] = useState<IDisplayItem>();

  const GetNewAmount = (props: { item: IDisplayItem }) => {
    const { item } = props;
    var amount: number = 0;
    if (item.discount) {
      if (item.discount.percent > 0) {
        amount =
          item.unitAmount - (item.unitAmount * item.discount.percent) / 100;
      } else {
        amount = item.unitAmount - item.discount.amount;
      }
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
  const onFinish = async (data: IDataShoppingCartPost) => {
    blockContext.block();
    await ShoppingCartService.post(data).then((response) => {
      if (response.success) {
        setReload(true);
      }
    });
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
      discount: material.discount,
      unitAmount: material.unitAmount,
    });
  };
  useEffect(() => {
    configureData();
  }, [material]);
  return (
    <>
      {item ? (
        <div className={type === "group" ? "item-group" : "item-list"}>
          <div className={type === "group" ? "image" : "left"}>
            <Link href={"/main/dashboard/payments/pos-sales/" + item.id}>
              <Image
                src={item.src}
                width={type === "group" ? 120 : 50}
                height={type === "group" ? 120 : 50}
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
                    <p>2100₮</p>
                    <p>2100₮</p>
                  </div>
                </div>
              </div>
            ) : null}
            {type === "group" ? (
              <>
                {item.coupon ? (
                  <div className="extra-bottom">
                    <p>
                      {item.coupon.conditionValue + "+" + item.coupon.quantity}
                    </p>
                  </div>
                ) : null}
                {item.discount ? (
                  <div className="extra-top">
                    {item.discount.amount > 0 ? (
                      <p>{item.discount.amount}₮</p>
                    ) : (
                      <p>{item.discount.percent}%</p>
                    )}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
          {type === "list" ? (
            <div className="right">
              {item.coupon || item.discount ? (
                <div className="extra">
                  {item.coupon ? (
                    <div className="coupon">
                      <p>
                        {item.coupon?.conditionValue +
                          "+" +
                          item.coupon?.quantity}
                      </p>
                    </div>
                  ) : null}
                  {item.discount ? (
                    <div className="discount">
                      {item.discount.amount > 0 ? (
                        <p>{item.discount.amount}₮</p>
                      ) : (
                        <p>{item.discount.percent}%</p>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <Button
                style={{
                  width: "100%",
                }}
                onClick={() =>
                  onFinish({
                    materialId: item.id,
                    quantity: 0,
                  })
                }
                icon={<ShoppingCartOutlined />}
              >
                Сагслах
              </Button>
            </div>
          ) : null}
          {type === "group" ? (
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
                  <p className={item.discount ? "text-line-through" : ""}>
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
                onClick={() =>
                  onFinish({
                    materialId: item.id,
                    quantity: 0,
                  })
                }
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
