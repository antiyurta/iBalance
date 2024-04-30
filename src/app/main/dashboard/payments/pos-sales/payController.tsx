import { useContext, useEffect, useState } from "react";
import NewModal from "@/components/modal";
import Item from "./component/Item";
import { Button, Typography } from "antd";
import StepIndex from "./steps/StepIndex";
import ShoppingTemp from "./component/ShoppingTemp";
import { usePaymentContext } from "@/feature/context/PaymentGroupContext";
import { NumericFormat } from "react-number-format";
import ExtraIndex from "./extra";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import MaterialSearch from "@/components/material-search";
import { createTemp } from "@/feature/store/slice/point-of-sale/temp.slice";
import {
  emptyGoods,
  saveGoods,
} from "@/feature/store/slice/point-of-sale/goods.slice";
import {
  emptyShoppingCart,
  onShoppingCart,
} from "@/feature/store/slice/point-of-sale/shopping-cart.slice";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { IGoods } from "@/service/pos/entities";
import { MaterialType } from "@/service/material/entities";

const { Title } = Typography;
const PayController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payAmount } = usePaymentContext();
  const warehouse = useTypedSelector((state) => state.warehouse);
  const shoppingGoods = useTypedSelector((state) => state.shoppingGoods);
  const { isModal } = useTypedSelector((state) => state.shoppingCart);

  const createShoppingTemps = () => {
    dispatch(createTemp(shoppingGoods));
    dispatch(emptyGoods());
  };
  const onMaterial = (material?: IDataViewMaterial) => {
    if (material) {
      const currentIndex = shoppingGoods.findIndex(
        (item) => item.materialId == material.id
      );
      const currentGoods: IGoods = {
        materialId: material.id,
        materialName: material.name,
        imageUrl: "/images/emptyMarket.png",
        sectionName: material.sectionName,
        unitAmount: material.unitAmount,
        quantity: 1,
        discountAmount: 0,
        payAmount: material.unitAmount,
        totalAmount: material.unitAmount,
      };
      if (currentIndex !== -1) {
        currentGoods.quantity = shoppingGoods[currentIndex].quantity + 1;
        currentGoods.payAmount =
          shoppingGoods[currentIndex].unitAmount *
          (shoppingGoods[currentIndex].quantity + 1);
      }
      dispatch(saveGoods(currentGoods));
    }
  };
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            height: 86,
          }}
        >
          <ExtraIndex />
          <MaterialSearch
            isDisable={false}
            warehouseId={warehouse.id}
            onMaterial={onMaterial}
            params={{ moreUnitAmount: 0, types: [MaterialType.Material] }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 110,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingLeft: 4,
            paddingRight: 14,
            width: "100%",
            height: "calc(100% - 280px)",
            overflowY: "auto",
          }}
        >
          {shoppingGoods?.map((goods) => (
            <Item key={goods.materialId} data={goods} />
          ))}
        </div>
        <div
          style={{
            width: "100%",
            position: "absolute",
            bottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Title
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#6C757D",
              }}
            >
              Барааны тоо ширхэг:
            </Title>
            <Title
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#6C757D",
                margin: 0,
              }}
            >
              {shoppingGoods?.length}
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Title
              level={3}
              style={{
                fontWeight: 600,
                color: "#6C757D",
                margin: 0,
              }}
            >
              Хөнгөлөлт, урамшууллын дүн:
            </Title>
            <Title
              level={3}
              style={{
                fontWeight: 600,
                color: "#6C757D",
                margin: 0,
              }}
            >
              <NumericFormat
                value={
                  shoppingGoods?.length > 0
                    ? shoppingGoods.reduce(
                        (total, item) =>
                          total +
                          (item.unitAmount - item.discountAmount) *
                            item.quantity,
                        0
                      )
                    : 0
                }
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                displayType="text"
                suffix="₮"
              />
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderTop: "1px dashed #ccc",
              borderBottom: "1px dashed #ccc",
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <Title
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "black",
              }}
            >
              Төлөх дүн:
            </Title>
            <Title
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "black",
                margin: 0,
              }}
            >
              <NumericFormat
                value={payAmount}
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                displayType="text"
                suffix="₮"
              />
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <ShoppingTemp />
            <button
              className="app-button-regular"
              style={{
                height: 38,
                minWidth: 120,
              }}
              onClick={createShoppingTemps}
            >
              Түр хадгалах
            </button>
            <Button
              style={{
                width: "100%",
              }}
              type="primary"
              disabled={shoppingGoods.length > 0 ? false : true}
              onClick={() => dispatch(onShoppingCart())}
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        </div>
      </div>
      <NewModal
        title=" "
        open={isModal}
        onCancel={() => dispatch(emptyShoppingCart())}
        width={400}
        footer={null}
        destroyOnClose
      >
        <StepIndex />
      </NewModal>
    </>
  );
};
export default PayController;
