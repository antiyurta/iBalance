import { NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
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
import { removeDuplicates } from "@/feature/common";
const ReportList = () => {
  const { setTabs, setTabKey, form, formStyle } = useReportContext();
  const [activeKey, setActiveKey] = useState<number>(0);
  const [searchField, setSearchField] = useState<string>("");
  const listNames = [
    {
      key: 0,
      title: "Бараа материалын товчоо тайлан",
      filterName: "RStorage1",
      filter: <RStorage1Filter />,
      children: <RStorage1 />,
    },
    {
      key: 1,
      title: "Бараа материалын товчоо тайлан (хураангуй)",
      filterName: "RStorage2",
      filter: <RStorage1Filter />,
      children: <RStorage2 />,
    },
    {
      key: 2,
      title: "Бараа материалын гүйлгээний тайлан",
      filterName: "RStorage3",
      filter: <RStorage2Filter />,
      children: <RStorage3 />,
    },
    {
      key: 3,
      title: "Агуулахын бүртгэл (гүйлгээний цонхоор)",
      filterName: "RStorage4",
      filter: <RStorage2Filter />,
      children: <RStorage4 />,
    },
    {
      key: 4,
      title: "Агуулахын бүртгэл (гүйлгээний утгаар)",
      filterName: "RStorage5",
      filter: <RStorage2Filter />,
      children: <RStorage5 />,
    },
    {
      key: 5,
      title: "Татан авалтын дэлгэрэнгүй тайлан (бараагаар)",
      filterName: "RStorage6",
      filter: <RStorage5Filter />,
      children: <RStorage6 />,
    },
    {
      key: 6,
      title: "Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filterName: "RStorage7",
      filter: <RStorage2Filter />,
      children: <RStorage7 />,
    },
    {
      key: 7,
      title: "Агуулах хоорондын хөдөлгөөний хураангуй тайлан",
      filterName: "RStorage8",
      filter: <RStorage1Filter />,
      children: <RStorage8 />,
    },
    {
      key: 8,
      title: "Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)",
      filterName: "RStorage9",
      filter: <RStorage6Filter />,
      children: <RStorage9 />,
    },
    {
      key: 9,
      title: "Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)",
      filterName: "RStorage10",
      filter: <RStorage6Filter />,
      children: <RStorage10 />,
    },
    {
      key: 10,
      title: "Материал хөрвүүлэлтийн тайлан (бараагаар)",
      filterName: "RStorage11",
      filter: <RStorage4Filter />,
      children: <RStorage11 />,
    },
    {
      key: 11,
      title: "Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)",
      filterName: "RStorage12",
      filter: <RStorage4Filter />,
      children: <RStorage12 />,
    },
    {
      key: 12,
      title: "Материал хольц, найруулгын тайлан (гүйлгээгээр)",
      filterName: "RStorage13",
      filter: <RStorage4Filter />,
      children: <RStorage13 />,
    },
    {
      key: 13,
      title: "Акт, хорогдол, устгалын товчоо тайлан",
      filterName: "RStorage14",
      filter: <RStorage1Filter />,
      children: <RStorage14 />,
    },
    {
      key: 14,
      title: "Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)",
      filterName: "RStorage15",
      filter: <RStorage5Filter />,
      children: <RStorage15 />,
    },
    {
      key: 15,
      title: "Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filterName: "RStorage16",
      filter: <RStorage5Filter />,
      children: <RStorage16 />,
    },
    {
      key: 16,
      title: "Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)",
      filterName: "RStorage17",
      filter: <RStorage5Filter />,
      children: <RStorage17 />,
    },
    {
      key: 17,
      title: "Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filterName: "RStorage18",
      filter: <RStorage2Filter />,
      children: <RStorage18 />,
    },
    {
      key: 18,
      title: "Тооллогын тайлан",
      filterName: "RStorage19",
      filter: <RStorage3Filter />,
      children: <RStorage19 />,
    },
    {
      key: 19,
      title: "Тооллогын хуудас",
      filterName: "RStorage20",
      filter: <RStorage3Filter />,
      children: <RStorage20 />,
    },
    {
      key: 20,
      title: "Бараа материалын насжилтын тайлан",
      filterName: "RStorage21",
      filter: <RStorage3Filter />,
      children: <RStorage21 />,
    },
    {
      key: 21,
      title: "Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/",
      filterName: "RStorage22",
      filter: <RStorage3Filter />,
      children: <RStorage22 />,
    },
    {
      key: 22,
      title: "Бараа материалын үлдэгдлийн тайлан /дуусах хугацаагаар/",
      filterName: "RStorage23",
      filter: <RStorage3Filter />,
      children: <RStorage23 />,
    },
  ];

  const filteredNames = listNames?.filter((name) =>
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
              {filteredNames?.map((list, index) => (
                <div
                  key={index}
                  className={activeKey === list.key ? "name-active" : "name"}
                  onClick={() => {
                    setActiveKey(list.key);
                  }}
                >
                  {list.title}
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
              {listNames[activeKey].title}
            </Title>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ span: 20 }}
              onFinish={() => {
                setTabs((prevTabs) => {
                  const uniqueValues = removeDuplicates(
                    [
                      ...prevTabs,
                      {
                        label: listNames[activeKey].title,
                        key: `items-${activeKey + 2}`,
                        children: listNames[activeKey].children,
                      },
                    ],
                    "key"
                  );
                  return uniqueValues;
                });
                setTabKey(`items-${activeKey + 2}`);
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
                {listNames[activeKey].filter}
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
export default ReportList;
