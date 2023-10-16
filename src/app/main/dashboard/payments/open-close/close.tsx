import { NewDatePicker, NewInputNumber, NewSelect } from "@/components/input";
import { Button, Divider, Form, Table, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CloseState = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div className="open-close-close">
        <Title
          style={{
            fontSize: 20,
            fontWeight: 500,
            textAlign: "center",
            padding: 12,
          }}
        >
          Хаалт хийх
        </Title>
        <div className="close-body">
          <div className="close-content">
            <Divider>Захиалга, хуваарилалт</Divider>
            <Table
              columns={[
                {
                  title: "Төлөв",
                },
                {
                  title: "Тоо, хэмжээ",
                },
                {
                  title: "Дүн",
                },
              ]}
            />
            <Divider>Борлуулалт</Divider>
            <Table
              columns={[
                {
                  title: "Төлөв",
                },
                {
                  title: "Тоо, хэмжээ",
                },
                {
                  title: "Дүн",
                },
              ]}
            />
            <Divider>Төлбөр төлөлт</Divider>
            <Table
              columns={[
                {
                  title: "Төлөв",
                },
                {
                  title: "Тоо, хэмжээ",
                },
                {
                  title: "Дүн",
                },
              ]}
            />
          </div>
          <div className="close-content">
            <Divider>Захиалга, хуваарилалт</Divider>
            <Table
              columns={[
                {
                  title: "Төлөв",
                },
                {
                  title: "Дүн",
                },
              ]}
            />
            <Divider>Бэлэн бус</Divider>
            <Table
              columns={[
                {
                  title: "Төлөв",
                },
                {
                  title: "Дүн",
                },
              ]}
            />
            <Divider />
            <Title level={3}>
              Нийт зөрүү (Бэлэн + Бэлэн бус) = [-5,000.00] + [0.00] =
              [-5,000.00]
            </Title>
            <Form layout="vertical">
              <div className="close-body">
                <Form.Item label="Бэлэн (тоолсон дүн оруулах)">
                  <NewInputNumber />
                </Form.Item>
                <Form.Item label="Бэлэн бус (Settlements)">
                  <NewInputNumber />
                </Form.Item>
                <Form.Item>
                  <NewSelect
                    options={[
                      {
                        label: "Хаан банк",
                        value: 1,
                      },
                    ]}
                  />
                </Form.Item>
                <Button type="primary">Settlement татах</Button>
              </div>
              <Form.Item label="Тайлбар">
                <NewSelect
                  options={[
                    {
                      label: "Мөнгө дутсан",
                      value: 1,
                    },
                  ]}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <NewDatePicker
          style={{
            minWidth: 140,
          }}
        />
        <Button
          style={{
            width: "100%",
          }}
          danger
        >
          Хаалт хийх
        </Button>
        <button
          className="app-button-regular"
          style={{
            height: 39,
            fontWeight: 400,
            minWidth: 140,
          }}
        >
          <PrinterOutlined />
          Тайлан хэвлэх
        </button>
      </div>
    </div>
  );
};
export default CloseState;
