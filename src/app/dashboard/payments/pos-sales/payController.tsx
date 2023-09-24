import Image from "next/image";
import { useState } from "react";
import {
  PlusCircleOutlined,
  CreditCardOutlined,
  SwapOutlined,
  CloseOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import Item from "./component/Item";
import { Badge, Button, Table, Typography } from "antd";
import StepIndex from "./steps/StepIndex";
import OpenClose from "../open-close/openClose";

const { Title } = Typography;
const PayController = () => {
  const [isOpenModalClose, setIsOpenModalClose] = useState<boolean>(false);
  const [isOpenModalSave, setIsOpenModalSave] = useState<boolean>(false);
  const [isOpenModalExtra, setIsOpenModalExtra] = useState<boolean>(false);
  const [isOpenModalSteps, setIsOpenModalSteps] = useState<boolean>(false);
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
              onClick={() => setIsOpenModalSave(true)}
            >
              <Badge count={3}>
                <Image
                  src="/images/save.png"
                  width={24}
                  height={24}
                  alt="save"
                />
              </Badge>
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
              onClick={() => setIsOpenModalSteps(true)}
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        </div>
      </div>
      <NewModal
        title="Түр хадгалах"
        open={isOpenModalSave}
        onCancel={() => setIsOpenModalSave(false)}
        footer={null}
      >
        <Table
          columns={[
            {
              title: "№",
              dataIndex: "id",
              render: (text) => {
                return <Button type="dashed" icon={<SwapOutlined />}></Button>;
              },
            },
            {
              title: "Баримтын дугаар",
            },
            {
              title: "Огноо",
            },
            {
              title: "Төлөх дүн",
            },
            {
              title: " ",
              render: () => {
                return (
                  <Button
                    style={{
                      padding: 0,
                    }}
                    type="text"
                    icon={
                      <CloseOutlined
                        style={{
                          fontSize: 24,
                          color: "red",
                        }}
                      />
                    }
                  />
                );
              },
            },
          ]}
          dataSource={[
            {
              id: 1,
            },
          ]}
        />
      </NewModal>
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
        <StepIndex />
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
    </>
  );
};
export default PayController;
