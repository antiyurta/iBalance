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
import { ShoppingGoodsService } from "@/service/pos/shopping-goods/service";
import { NumericFormat } from "react-number-format";
import ExtraIndex from "./extra";

const { Title } = Typography;
const PayController = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const { isReload, setReload } = usePaymentGroupContext();
  const [isOpenModalSteps, setIsOpenModalSteps] = useState<boolean>(false);
  const [shoppingCarts, setShoppingCarts] = useState<IDataShoppingCart[]>([]);
  //
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalDiscountAndCoupon, setTotalDiscountAndCoupon] =
    useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const getShoppingCarts = async () => {
    await ShoppingCartService.get()
      .then((response) => {
        if (response.success) {
          setShoppingCarts(response.response);
          setReload(false);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const createShoppingGoods = async () => {
    await ShoppingGoodsService.post({
      shoppingCartIds: shoppingCarts.map((cart) => cart.id),
    }).then((response) => {
      if (response.success) {
        getShoppingCarts();
        setReload(true);
      }
    });
  };
  useEffect(() => {
    isReload && getShoppingCarts();
  }, [isReload]);

  const getAll = () => {
    return shoppingCarts
      .map((cart) => {
        var backDiscount: number = 0;
        var backCoupon: number = 0;
        if (cart.discount) {
          backDiscount = cart.unitAmount * cart.quantity - cart.amount;
        } else {
          backDiscount = 0;
        }
        if (cart.coupon && cart.coupon.conditionValue < cart.quantity) {
          backCoupon = cart.amount / cart.quantity;
        } else {
          backCoupon = 0;
        }
        return backDiscount + backCoupon;
      })
      .reduce((total: number, arg: number) => total + arg, 0);
  };

  useEffect(() => {
    // niit too shirheg bodoh
    setTotalQuantity(
      shoppingCarts.reduce((total: number, cart) => total + cart.quantity, 0)
    );
    // niit dun bodoh
    setTotalAmount(
      shoppingCarts.reduce((total: number, cart) => total + cart.amount, 0)
    );
    // niit hongololt uruamshuulal bodoh
    setTotalDiscountAndCoupon(getAll());
  }, [shoppingCarts]);
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
          {shoppingCarts?.map((cart) => (
            <Item key={cart.id} data={cart} />
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
              {totalQuantity}
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
                value={totalDiscountAndCoupon}
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
                value={totalAmount}
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
              onClick={createShoppingGoods}
            >
              Түр хадгалах
            </button>
            <Button
              style={{
                width: "100%",
              }}
              type="primary"
              disabled={shoppingCarts.length > 0 ? false : true}
              onClick={() => setIsOpenModalSteps(true)}
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
        <StepIndex amount={totalAmount} bonus={totalDiscountAndCoupon} />
      </NewModal>
    </>
  );
};
export default PayController;
