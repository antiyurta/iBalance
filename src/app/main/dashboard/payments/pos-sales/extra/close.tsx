import NewModal from "@/components/modal";
import { CreditCardOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useState } from "react";
import OpenClose from "../../open-close/openClose";

const { Title } = Typography;

const Close = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  return (
    <>
      <div
        onClick={() => setIsOpenModal(true)}
        className="payment-type-box-red"
      >
        <CreditCardOutlined
          style={{
            color: "red",
            fontSize: 24,
          }}
        />
        <Title
          level={4}
          style={{
            fontWeight: 700,
            color: "red",
            textAlign: "center",
          }}
        >
          Хаалт хийх
        </Title>
      </div>
      <NewModal
        title=" "
        open={isOpenModal}
        width={1000}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
      >
        <OpenClose type="close" />
      </NewModal>
    </>
  );
};
export default Close;
