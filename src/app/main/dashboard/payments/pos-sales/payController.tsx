import { useContext, useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  LeftOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import Item from "./component/Item";
import { Badge, Button, Form, Typography } from "antd";
import StepIndex from "./steps/StepIndex";
import OpenClose from "../open-close/openClose";
import ShoppingGoods from "./component/ShoppingGoods";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { ShoppingGoodsService } from "@/service/pos/shopping-goods/service";
import { NumericFormat } from "react-number-format";

const { Title } = Typography;
const PayController = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const { isReload, setReload } = usePaymentGroupContext();
  const [isOpenModalTransfer, setIsOpenModalTransfer] =
    useState<boolean>(false);
  const [isOpenModalClose, setIsOpenModalClose] = useState<boolean>(false);
  const [isOpenModalExtra, setIsOpenModalExtra] = useState<boolean>(false);
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
          <button
            onClick={() => setIsOpenModalExtra(true)}
            className="app-button-regular"
            style={{
              width: "100%",
            }}
          >
            <PlusCircleOutlined />
            Нэмэлт үйлдэл
          </button>
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
            paddingRight: 20,
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
        width={500}
        open={isOpenModalExtra}
        onCancel={() => setIsOpenModalExtra(false)}
        footer={false}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Нэмэлт үйлдлүүд
        </p>
        <div className="form-grid-2">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              gap: 12,
            }}
          >
            <Title
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Менежерийн эрх
            </Title>
            <div className="form-grid-2">
              <div className="payment-type-box">1</div>
              <div className="payment-type-box">1</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              gap: 12,
            }}
          >
            <Title
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Кассчины эрх
            </Title>
            <div className="form-grid-2">
              <div
                onClick={() => {
                  setIsOpenModalTransfer(true);
                  setIsOpenModalExtra(false);
                }}
                className="payment-type-box"
              >
                <CreditCardOutlined
                  style={{
                    color: "#86909C",
                    fontSize: 24,
                  }}
                />
                <Title
                  level={4}
                  style={{
                    fontWeight: 700,
                    color: "#86909C",
                  }}
                >
                  Мөнгө нэмэх, хасах, шилжүүлэг
                </Title>
              </div>
              <div className="payment-type-box">
                <CreditCardOutlined
                  style={{
                    color: "#86909C",
                    fontSize: 24,
                  }}
                />
                <Title
                  level={4}
                  style={{
                    fontWeight: 700,
                    color: "#86909C",
                  }}
                >
                  Бэлэн мөнгө
                </Title>
              </div>
              <div
                onClick={() => {
                  setIsOpenModalClose(true);
                }}
                className="payment-type-box"
              >
                <FileTextOutlined
                  style={{
                    color: "#DC3545",
                    fontSize: 24,
                  }}
                />
                <Title
                  level={4}
                  style={{
                    fontWeight: 700,
                    color: "#DC3545",
                  }}
                >
                  Хаалт хийх
                </Title>
              </div>
            </div>
          </div>
        </div>
      </NewModal>
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
      <NewModal
        title=" "
        open={isOpenModalClose}
        width={1000}
        onCancel={() => setIsOpenModalClose(false)}
        footer={null}
      >
        <OpenClose type="close" />
      </NewModal>
      <NewModal
        title=" "
        open={isOpenModalTransfer}
        onCancel={() => setIsOpenModalTransfer(false)}
        width={300}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingTop: 12,
        }}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>Мөнгө нэмэх, хасах, шилжүүлэх</Title>

          <Button
            type="text"
            style={{
              height: 48,
            }}
          >
            <Badge count={3}>
              <BellOutlined
                style={{
                  color: "#198754",
                  fontSize: 24,
                }}
              />
            </Badge>
          </Button>
        </div>
        <Form layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Form.Item label="Бэлэн/Бэлэн бусын хэлбэр">
              <NewSelect
                options={[
                  {
                    label: "Бэлэн",
                    value: 0,
                  },
                  {
                    label: "Бэлэн бус",
                    value: 2,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Нэмэх/Хасах/Шилжүүлэг">
              <NewSelect
                options={[
                  {
                    label: "Нэмэх",
                    value: 0,
                  },
                  {
                    label: "Хасах",
                    value: 1,
                  },
                  {
                    label: "Шилжүүлэг",
                    value: 2,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Дүн">
              <NewInputNumber />
            </Form.Item>
            <Form.Item label="Гүйлгээний утга">
              <NewInput />
            </Form.Item>
          </div>
        </Form>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Button icon={<LeftOutlined />} />
          <Button
            type="primary"
            style={{
              width: "100%",
            }}
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </NewModal>
    </>
  );
};
export default PayController;
