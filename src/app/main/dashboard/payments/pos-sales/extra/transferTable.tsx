import { Badge, Button, Table, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import NewModal from "@/components/modal";

const { Title } = Typography;

const TransferModal = () => {
  const [data, setData] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  useEffect(() => {
    console.log("end table iin data tatah");
  }, []);
  return (
    <div>
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
            onClick={() => setIsOpenModal(true)}
          />
        </Badge>
      </Button>
      <NewModal
        title=" "
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
            }}
          >
            Мөнгө нэмэх, хасах, шилжүүлэг
          </Title>
          <Table
            columns={[
              {
                title: "№",
              },
              {
                title: "Касс нэр / ID код",
              },
              {
                title: "Шилжүүлгийн дүн",
              },
              {
                title: "Үйлдэл",
              },
            ]}
          />
        </div>
      </NewModal>
    </div>
  );
};
export default TransferModal;
