import { NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const { Title } = Typography;

import RStorage1Filter from "./filters/RStorage1Filter";
import RStorage2Filter from "./filters/RStorage2Filter";
import RStorage3Filter from "./filters/RStorage3Filter";
import RStorage4Filter from "./filters/RStorage4Filter";
import RStorage5Filter from "./filters/RStorage5Filter";
import RStorage6Filter from "./filters/RStorage6Filter";
import RStorage1 from "./document/RStorage1";
import RStorage2 from "./document/RStorage2";
//Бараа материалын гүйлгээний тайлан
import RStorage3 from "./document/RStorage3";
//Агуулахын бүртгэл (гүйлгээний цонхоор)
import RStorage4 from "./document/RStorage4";
//Агуулахын бүртгэл (гүйлгээний утгаар)
import RStorage5 from "./document/RStorage5";
//Татан авалтын дэлгэрэнгүй тайлан (бараагаар)
import RStorage6 from "./document/RStorage6";
//Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage7 from "./document/RStorage7";
//Агуулах хоорондын хөдөлгөөний хураангуй тайлан
import RStorage8 from "./document/RStorage8";
//Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)
import RStorage9 from "./document/RStorage9";
//Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)
import RStorage10 from "./document/RStorage10";
//Материал хөрвүүлэлтийн тайлан (бараагаар)
import RStorage11 from "./document/RStorage11";
//Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)
import RStorage12 from "./document/RStorage12";
//Материал хольц, найруулгын тайлан (гүйлгээгээр)
import RStorage13 from "./document/RStorage13";
//Акт, хорогдол, устгалын товчоо тайлан
import RStorage14 from "./document/RStorage14";
//Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)
import RStorage15 from "./document/RStorage15";
//Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage16 from "./document/RStorage16";
// Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)
import RStorage17 from "./document/RStorage17";
// Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage18 from "./document/RStorage18";
// Тооллогын тайлан
import RStorage19 from "./document/RStorage19";
// Тооллогын хуудас
import RStorage20 from "./document/RStorage20";
// Бараа материалын насжилтын тайлан
import RStorage21 from "./document/RStorage21";
// Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/
import RStorage22 from "./document/RStorage22";
// Бараа материалын үлдэгдэл тайлан /дуусах хугацаагаар/
import RStorage23 from "./document/RStorage23";
import { useReportContext } from "@/feature/context/ReportsContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { savePanel } from "@/feature/store/slice/report.slice";
import { useTypedSelector } from "@/feature/store/reducer";
interface IReport {
  key: string;
  title: string;
  filter: React.ReactNode;
  children: React.ReactNode;
}

const Report: React.FC = () => {
  const { form, formStyle } = useReportContext();
  const { items } = useTypedSelector((state) => state.reportPanel);
  const [selectedItem, setSelectedItem] = useState<IReport>({
    key: "item-1",
    title: "Бараа материалын товчоо тайлан",
    filter: <RStorage1Filter />,
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
                {selectedItem.filter}
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
