import { useContext, useEffect, useState } from "react";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import Item from "./component/Item";
import { Button, Typography } from "antd";
import StepIndex from "./steps/StepIndex";
import ShoppingGoods from "./component/ShoppingGoods";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { ShoppingGoodsService } from "@/service/pos/shopping-card/goods/service";
import { NumericFormat } from "react-number-format";
import ExtraIndex from "./extra";
import { IDataShoppingGoods } from "@/service/pos/shopping-card/goods/entites";
import { ShoppingTempService } from "@/service/pos/shopping-card/temp/service";

const { Title } = Typography;
const PayController = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const { isReload, setReload, isReloadCart } =
    usePaymentGroupContext();
  const [isOpenModalSteps, setIsOpenModalSteps] = useState<boolean>(false);
  const [shoppingGoods, setShoppingGoods] = useState<IDataShoppingGoods[]>([]);
  const [shoppingCart, setShoppingCart] = useState<IDataShoppingCart>();
  const getShoppingGoods = async () => {
    await ShoppingGoodsService.get()
      .then((response) => {
        if (response.success) {
          setShoppingGoods(response.response);
          setReload(false);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const createShoppingTemps = async () => {
    await ShoppingTempService.post({
      goodsIds: shoppingGoods.map((goods) => goods.id),
    }).then((response) => {
      if (response.success) {
        getShoppingGoods();
        setReload(true);
      }
    });
  };
  const createShoppingCart = async () => {
    await ShoppingCartService.post({
      goodsIds: shoppingGoods.map((goods) => goods.id),
    }).then((response) => {
      if (response.success) {
        setIsOpenModalSteps(true);
        setShoppingCart(response.response);
      }
    });
  };
  const getShoppingCart = async () => {
    if (shoppingCart) {
      await ShoppingCartService.getById(shoppingCart.id).then((response) => {
        if (response.success) {
          setShoppingCart(response.response);
        }
      });
    }
  };
  useEffect(() => {
    getShoppingCart();
  }, [isReloadCart]);
  useEffect(() => {
    isReload && getShoppingGoods();
  }, [isReload]);

  const getAll = () => {
    // return shoppingGoods
    //   .map((goods) => {
    //     var backDiscount: number = 0;
    //     var backCoupon: number = 0;
    //     if (shoppingGoods.discount) {
    //       backDiscount = cart.unitAmount * cart.quantity - cart.amount;
    //     } else {
    //       backDiscount = 0;
    //     }
    //     if (cart.coupon && cart.coupon.conditionValue < cart.quantity) {
    //       backCoupon = cart.amount / cart.quantity;
    //     } else {
    //       backCoupon = 0;
    //     }
    //     return backDiscount + backCoupon;
    //   })
    //   .reduce((total: number, arg: number) => total + arg, 0);
    // TODO
  };

  useEffect(() => {
    // niit too shirheg bodoh
    // setTotalQuantity(
    //   shoppingCarts.reduce((total: number, cart) => total + cart.quantity, 0)
    // );
    // niit dun bodoh
    // setTotalAmount(
    //   shoppingCarts.reduce((total: number, cart) => total + cart.amount, 0)
    // );
    // niit hongololt uruamshuulal bodoh
    // setTotalDiscountAndCoupon(getAll());
    // TODO
  }, [shoppingGoods]);
  //
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
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
          <NewInput placeholder="Хайх" />
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <Title level={3}>Сонгосон бараа</Title>
            <Title
              level={4}
              type="secondary"
              style={{
                margin: 0,
              }}
            >
              №:2023032701001
            </Title>
          </div>
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
            <Item key={goods.id} data={goods} />
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
              {shoppingCart?.quantity}
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div></div>
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
                value={shoppingCart?.membershipDiscountAmount}
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
                value={shoppingCart?.payAmount}
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
            <ShoppingGoods />
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
              onClick={() => createShoppingCart()}
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        </div>
      </div>
      <NewModal
        title=" "
        open={isOpenModalSteps}
        onCancel={() => setIsOpenModalSteps(false)}
        width={400}
        footer={null}
        destroyOnClose
      >
        {shoppingCart ? <StepIndex shoppingCart={shoppingCart} /> : null}
      </NewModal>
    </>
  );
};
export default PayController;
