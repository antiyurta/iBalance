import NewModal from "@/components/modal";
import {
  PlusCircleOutlined,
  CarOutlined,
  UnorderedListOutlined,
  SnippetsOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useState } from "react";
import Transfer from "./transfer";
import Return from "./return";
import Close from "./close";
import { useDispatch } from "react-redux";
import { newTab } from "@/feature/store/slice/tab.slice";

const { Title } = Typography;

const ExtraIndex = () => {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  return (
    <div>
      <Button
        onClick={() => setIsOpenModal(true)}
        style={{
          width: "100%",
        }}
      >
        <PlusCircleOutlined />
        Нэмэлт үйлдэл
      </Button>
      <NewModal
        title=" "
        width={360}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
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
        <div className="form-grid-3">
          <Transfer />
          <div
            onClick={() => {
              setIsOpenModal(false);
            }}
            className="payment-type-box-gray"
          >
            <CarOutlined
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
                textAlign: "center",
              }}
            >
              Зогсоолын хуудас хэвлэх
            </Title>
          </div>
          <div
            onClick={() => {
              setIsOpenModal(false);
              dispatch(
                newTab({
                  label: "Баримтын жагсаалт",
                  key: "/payments/list-of-receipt",
                  closeable: true,
                  breadcrumb: ["Төлбөр", "Баримтын жагсаалт"],
                })
              );
            }}
            className="payment-type-box-gray"
          >
            <UnorderedListOutlined
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
                textAlign: "center",
              }}
            >
              Баримтын жагсаалт харах
            </Title>
          </div>
          <div
            className="payment-type-box-gray"
            onClick={() => {
              setIsOpenModal(false);
              dispatch(
                newTab({
                  label: "Баримтын жагсаалт",
                  key: "/payments/list-of-receipt",
                  closeable: true,
                  breadcrumb: ["Төлбөр", "Баримтын жагсаалт"],
                })
              );
            }}
          >
            <SnippetsOutlined
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
                textAlign: "center",
              }}
            >
              Нээлт, хаалтын түүх
            </Title>
          </div>
          <div className="payment-type-box-gray">
            <PrinterOutlined
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
                textAlign: "center",
              }}
            >
              Өдрийн тайлан хэвлэх
            </Title>
          </div>
          <Return />
          <Close />
          <div
            style={{
              gridColumn: "span 2 / span 2",
            }}
            className="payment-type-box-blue"
          >
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#0D6EFD",
                textAlign: "center",
              }}
            >
              НӨАТУС илгээх
            </Title>
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#0D6EFD",
                textAlign: "center",
              }}
            >
              0000038
            </Title>
          </div>
        </div>
      </NewModal>
    </div>
  );
};
export default ExtraIndex;
