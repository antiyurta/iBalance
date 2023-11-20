import {
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewSelect,
  NewTextArea,
} from "@/components/input";
import NewModal from "@/components/modal";
import { WarningOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Form, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

const Return = () => {
  const [form] = Form.useForm();
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  return (
    <>
      <div
        onClick={() => {
          setIsOpenModal(true);
        }}
        className="payment-type-box-red"
      >
        <WarningOutlined
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
          Буцаалт хийх
        </Title>
      </div>
      <NewModal
        title=""
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingTop: 12,
        }}
        okButtonProps={{
          danger: true,
        }}
        okText="Буцаалт хийх"
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Title level={2}>Буцаалт хийх</Title>
            <Form.Item label="Буцаалтын шалтгаан:">
              <NewTextArea />
              <Title
                level={5}
                style={{
                  color: "red",
                  textAlign: "end",
                  paddingTop: 12,
                }}
              >
                Буцаах үйлдэл хийгдсэнээр дараах мэдээллүүд цуцлагдахыг анхаарна
                уу!
              </Title>
            </Form.Item>
            <div className="form-grid-2">
              <Form.Item label="Татварын ДДТД">
                <NewInput />
              </Form.Item>
              <Form.Item label="Төлбөр тооцоо">
                <NewDatePicker />
              </Form.Item>
              {isShowMore ? (
                <>
                  <Form.Item label="ИБарамтын төлөв">
                    <NewSelect />
                  </Form.Item>
                  <Form.Item label="Ибаримт руу илгээх дүн">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Нийт дүн">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Харилцагчийн хөнгөлөлт">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Бараа материалын үнийн хөнгөлөлт">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Төлөх дүн">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Төлсөн дүн">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Ашигласан огноо">
                    <NewInputNumber />
                  </Form.Item>
                  <Form.Item label="Бэлгийн карт">
                    <NewInputNumber />
                  </Form.Item>
                </>
              ) : null}
            </div>
            <button
              className="app-button-regular"
              onClick={() => setIsShowMore(!isShowMore)}
            >
              {isShowMore ? <UpOutlined /> : <DownOutlined />}
            </button>
          </div>
        </Form>
      </NewModal>
    </>
  );
};
export default Return;
