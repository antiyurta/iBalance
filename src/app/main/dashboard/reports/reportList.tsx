import { NewSearch } from "@/components/input";
import { Button, Col, Form, Row, Typography } from "antd";
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

const ReportList = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { set } = useReportContext();
  const [activeKey, setActiveKey] = useState<number>(0);

  const listNames = [
    {
      title: "Бараа материалын товчоо тайлан",
      filterName: "RStorage1",
      filter: <RStorage1Filter form={form} />,
      children: <RStorage1 />,
    },
    {
      title: "Бараа материалын товчоо тайлан (хураангуй)",
      filterName: "RStorage2",
      filter: <RStorage2Filter />,
      children: <RStorage2 />,
    },
  ];

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
            <NewSearch />
            <div className="names">
              {listNames?.map((list, index) => (
                <div
                  key={index}
                  className={activeKey === index ? "name-active" : "name"}
                  onClick={() => {
                    setActiveKey(index);
                  }}
                >
                  {list.title}
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col span={16}>
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
        </Col>
      </Row>
    </div>
  );
};
export default ReportList;
