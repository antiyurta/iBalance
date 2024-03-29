import { NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useReportContext } from "@/feature/context/ReportsContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { savePanel } from "@/feature/store/slice/report.slice";
import { IReport, reportList } from "./data";
import RStorage1Filter from "./filters/RStorage1Filter";
import RStorage1 from "./document/RStorage1";
const { Title } = Typography;

const Report: React.FC = () => {
  const { form, formStyle } = useReportContext();
  const [selectedItem, setSelectedItem] = useState<IReport>({
    key: "item-1",
    title: "Бараа материалын товчоо тайлан",
    filter: <RStorage1Filter reportKey="item-1" />,
    children: <RStorage1 />,
  });
  const dispatch = useDispatch<AppDispatch>();
  const [searchField, setSearchField] = useState<string>("");
  const filteredItems = reportList?.filter((name) =>
    name.title?.toLowerCase().includes(searchField.toLowerCase())
  );
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={8}>
          <div className="reportList-names">
            <Title
              style={{
                width: "100%",
                textAlign: "center",
              }}
              level={3}
            >
              Тайлангууд
            </Title>
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <NewInput
              placeholder="Хайх"
              onChange={(e) => {
                setSearchField(e.target.value);
              }}
            />
            <div className="names">
              {filteredItems?.map((item, index) => (
                <div
                  key={index}
                  className={
                    selectedItem.key === item.key ? "name-active" : "name"
                  }
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col span={16}>
          <Space
            style={{
              width: "100%",
            }}
            direction="vertical"
            size={12}
          >
            <Title
              level={2}
              style={{
                textAlign: "center",
              }}
            >
              {selectedItem.title}
            </Title>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ span: 20 }}
              onFinish={(values) => {
                dispatch(
                  savePanel({
                    key: selectedItem.key,
                    param: values,
                  })
                );
              }}
              style={formStyle}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {selectedItem?.filter}
                <Form.Item
                  style={{
                    alignSelf: "end",
                  }}
                >
                  <Button
                    icon={<FilterOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    Шүүх
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
export default Report;
