import Image from "next/image";
import { useState } from "react";
import { PlusCircleOutlined, CreditCardOutlined } from "@ant-design/icons";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import Item from "./component/Item";
import { Button, Typography } from "antd";

const { Title } = Typography;
const PayController = () => {
  const [isOpenModalExtra, setIsOpenModalExtra] = useState<boolean>(false);
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
            gap: 20,
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
        </div>
        <div
          style={{
            position: "absolute",
            top: 106,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            paddingRight: 20,
            height: "calc(100% - 280px)",
            overflowY: "auto",
          }}
        >
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
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
              26
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
              12,000.00₮
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
              88,8888
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <button
              className="app-button-regular"
              style={{
                height: 38,
              }}
            >
              <Image src="/images/save.png" width={24} height={24} alt="save" />
            </button>
            <button
              className="app-button-regular"
              style={{
                height: 38,
                minWidth: 120,
              }}
            >
              Түр хадгалах
            </button>
            <Button
              style={{
                width: "100%",
              }}
              type="primary"
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        </div>
      </div>
      <NewModal
        title=" "
        width={500}
        positionTitle="center"
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
              Менежерийн эрх
            </Title>
            <div className="form-grid-2">
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
              <div className="payment-type-box">1</div>
            </div>
          </div>
        </div>
      </NewModal>
    </>
  );
};
export default PayController;
