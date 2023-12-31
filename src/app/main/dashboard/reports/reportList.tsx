import { NewInput } from "@/components/input";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import { useReportContext } from "@/feature/context/ReportsContext";
import { useDispatch } from "react-redux";
import { ReportActions } from "@/feature/core/actions/ReportActions";
import { useState } from "react";
const { Title } = Typography;

//Бараа материалын товчоо тайлан
import RStorage1 from "./document/RStorage1";
import RStorage1Filter from "./filters/RStorage1Filter";
//Бараа материалын товчоо тайлан (хураангуй)
import RStorage2 from "./document/RStorage2";
import RStorage2Filter from "./filters/RStorage2Filter";
//Бараа материалын гүйлгээний тайлан
import RStorage3 from "./document/RStorage3";
import RStorage3Filter from "./filters/RStorage3Filter";
//Агуулахын бүртгэл (гүйлгээний цонхоор)
import RStorage4 from "./document/RStorage4";
import RStorage4Filter from "./filters/RStorage4Filter";
//Агуулахын бүртгэл (гүйлгээний утгаар)
import RStorage5 from "./document/RStorage5";
import RStorage5Filter from "./filters/RStorage5Filter";
//Татан авалтын дэлгэрэнгүй тайлан (бараагаар)
import RStorage6 from "./document/RStorage6";
import RStorage6Filter from "./filters/RStorage6Filter";
//Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage7 from "./document/RStorage7";
import RStorage7Filter from "./filters/RStorage7Filter";
//Агуулах хоорондын хөдөлгөөний хураангуй тайлан
import RStorage8 from "./document/RStorage8";
import RStorage8Filter from "./filters/RStorage8Filter";
//Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)
import RStorage9 from "./document/RStorage9";
import RStorage9Filter from "./filters/RStorage9Filter";
//Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)
import RStorage10 from "./document/RStorage10";
import RStorage10Filter from "./filters/RStorage10Filter";
//Материал хөрвүүлэлтийн тайлан (бараагаар)
import RStorage11 from "./document/RStorage11";
import RStorage11Filter from "./filters/RStorage11Filter";
//Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)
import RStorage12 from "./document/RStorage12";
import RStorage12Filter from "./filters/RStorage12Filter";
//Материал хольц, найруулгын тайлан (гүйлгээгээр)
import RStorage13 from "./document/RStorage13";
import RStorage13Filter from "./filters/RStorage13Filter";
//Акт, хорогдол, устгалын товчоо тайлан
import RStorage14 from "./document/RStorage14";
import RStorage14Filter from "./filters/RStorage14Filter";
//Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)
import RStorage15 from "./document/RStorage15";
import RStorage15Filter from "./filters/RStorage15Filter";
//Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage16 from "./document/RStorage16";
import RStorage16Filter from "./filters/RStorage16Filter";
// Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)
import RStorage17 from "./document/RStorage17";
import RStorage17Filter from "./filters/RStorage17Filter";
// Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage18 from "./document/RStorage18";
import RStorage18Filter from "./filters/RStorage18Filter";
// Тооллогын тайлан
import RStorage19 from "./document/RStorage19";
import RStorage19Filter from "./filters/RStorage19Filter";
// Тооллогын хуудас
import RStorage20 from "./document/RStorage20";
import RStorage20Filter from "./filters/RStorage20Filter";
// Бараа материалын насжилтын тайлан
import RStorage21 from "./document/RStorage21";
import RStorage21Filter from "./filters/RStorage21Filter";
// Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/
import RStorage22 from "./document/RStorage22";
import RStorage22Filter from "./filters/RStorage22Filter";
// Бараа материалын үлдэгдэл тайлан /дуусах хугацаагаар/
import RStorage23 from "./document/RStorage23";
import RStorage23Filter from "./filters/RStorage23Filter";

const ReportList = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { set } = useReportContext();
  const [activeKey, setActiveKey] = useState<number>(0);
  const [searchField, setSearchField] = useState<string>("");
  const listNames = [
    {
      key: 0,
      title: "Бараа материалын товчоо тайлан",
      filterName: "RStorage1",
      filter: <RStorage1Filter form={form} />,
      children: <RStorage1 />,
    },
    {
      key: 1,
      title: "Бараа материалын товчоо тайлан (хураангуй)",
      filterName: "RStorage2",
      filter: <RStorage1Filter form={form} />,
      children: <RStorage2 />,
    },
    {
      key: 2,
      title: "Бараа материалын гүйлгээний тайлан",
      filterName: "RStorage3",
      filter: <RStorage3Filter />,
      children: <RStorage3 />,
    },
    {
      key: 3,
      title: "Агуулахын бүртгэл (гүйлгээний цонхоор)",
      filterName: "RStorage4",
      filter: <RStorage4Filter />,
      children: <RStorage4 />,
    },
    {
      key: 4,
      title: "Агуулахын бүртгэл (гүйлгээний утгаар)",
      filterName: "RStorage5",
      filter: <RStorage5Filter />,
      children: <RStorage5 />,
    },
    {
      key: 5,
      title: "Татан авалтын дэлгэрэнгүй тайлан (бараагаар)",
      filterName: "RStorage6",
      filter: <RStorage6Filter />,
      children: <RStorage6 />,
    },
    {
      key: 6,
      title: "Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filterName: "RStorage7",
      filter: <RStorage7Filter />,
      children: <RStorage7 />,
    },
    {
      key: 7,
      title: "Агуулах хоорондын хөдөлгөөний хураангуй тайлан",
      filterName: "RStorage8",
      filter: <RStorage8Filter />,
      children: <RStorage8 />,
    },
    {
      key: 8,
      title: "Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)",
      filterName: "RStorage9",
      filter: <RStorage9Filter />,
      children: <RStorage9 />,
    },
    {
      key: 9,
      title: "Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)",
      filterName: "RStorage10",
      filter: <RStorage10Filter />,
      children: <RStorage10 />,
    },
    {
      key: 10,
      title: "Материал хөрвүүлэлтийн тайлан (бараагаар)",
      filterName: "RStorage11",
      filter: <RStorage11Filter />,
      children: <RStorage11 />,
    },
    {
      key: 11,
      title: "Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)",
      filterName: "RStorage12",
      filter: <RStorage12Filter />,
      children: <RStorage12 />,
    },
    {
      key: 12,
      title: "Материал хольц, найруулгын тайлан (гүйлгээгээр)",
      filterName: "RStorage13",
      filter: <RStorage13Filter />,
      children: <RStorage13 />,
    },
    {
      key: 13,
      title: "Акт, хорогдол, устгалын товчоо тайлан",
      filterName: "RStorage14",
      filter: <RStorage14Filter />,
      children: <RStorage14 />,
    },
    {
      key: 14,
      title: "Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)",
      filterName: "RStorage15",
      filter: <RStorage15Filter />,
      children: <RStorage15 />,
    },
    {
      key: 15,
      title: "Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filterName: "RStorage16",
      filter: <RStorage16Filter />,
      children: <RStorage16 />,
    },
    {
      key: 16,
      title: "Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)",
      filterName: "RStorage17",
      filter: <RStorage17Filter />,
      children: <RStorage17 />,
    },
    {
      key: 17,
      title: "Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filterName: "RStorage18",
      filter: <RStorage18Filter />,
      children: <RStorage18 />,
    },
    {
      key: 18,
      title: "Тооллогын тайлан",
      filterName: "RStorage19",
      filter: <RStorage19Filter />,
      children: <RStorage19 />,
    },
    {
      key: 19,
      title: "Тооллогын хуудас",
      filterName: "RStorage20",
      filter: <RStorage20Filter />,
      children: <RStorage20 />,
    },
    {
      key: 20,
      title: "Бараа материалын насжилтын тайлан",
      filterName: "RStorage21",
      filter: <RStorage21Filter />,
      children: <RStorage21 />,
    },
    {
      key: 21,
      title: "Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/",
      filterName: "RStorage22",
      filter: <RStorage22Filter />,
      children: <RStorage22 />,
    },
    {
      key: 22,
      title: "Бараа материалын үлдэгдэл тайлан /дуусах хугацаагаар/",
      filterName: "RStorage23",
      filter: <RStorage23Filter />,
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
              layout="vertical"
              onFinish={(values) => {
                dispatch(
                  ReportActions.setFilterValues({
                    [`${listNames[activeKey].filterName}`]: {
                      ...values,
                    },
                  })
                );
                set({
                  title: listNames[activeKey].title,
                  key: `items-${activeKey + 2}`,
                  children: listNames[activeKey].children,
                });
              }}
              style={{
                width: 500,
                margin: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {listNames[activeKey].filter}
                <Form.Item>
                  <Button htmlType="submit">Шүүх</Button>
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
