import { NewDatePicker, NewSearch, NewSelect } from "@/components/input";
import { Button, Col, Form, Row, Typography } from "antd";
import listNames from "./listNames.json";
import { useState } from "react";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/mn_MN";
import "dayjs/locale/mn";
import { NewMultipleDatePicker } from "@/components/multiDatePicker";
const { Title } = Typography;

interface IJsonFilter {
  type: string;
}

interface IJson {
  name: string;
  filters: IJsonFilter[];
}

const ReportList = () => {
  const [activeKey, setActiveKey] = useState<number>(0);
  const [filters, setFilters] = useState<IJsonFilter[]>(listNames[0].filters);

  // form item hiih
  const FormItemInType = ({ type }: { type: string }) => {
    const value = [dayjs(new Date()), dayjs(new Date())];
    if (type === "date") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            alignItems: "flex-end",
          }}
        >
          <Form.Item label="Интервал">
            <NewSelect
              style={{
                width: 100,
              }}
              options={[
                {
                  label: "Тухайн",
                  value: "that",
                },
                {
                  label: "Хооронд",
                  value: "between",
                },
                {
                  label: "Хүртэл",
                  value: "until",
                },
                {
                  label: "Хойшхи",
                  value: "late",
                },
                {
                  label: "Сонголтод",
                  value: "selection",
                },
                {
                  value: "year",
                  label: "Жил",
                },
                {
                  value: "month",
                  label: "Сар",
                },
                {
                  value: "quarter",
                  label: "Улирал",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="datedd">
            <NewDatePicker locale={locale} />
          </Form.Item>
          <Form.Item name="multi">
            <NewMultipleDatePicker
              format="YYYY/MM"
              onlyMonthPicker
              highlightToday={false}
            />
          </Form.Item>
        </div>
      );
    }
  };

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
              {listNames?.map((list: IJson, index) => (
                <div
                  key={index}
                  className={activeKey === index ? "name-active" : "name"}
                  onClick={() => {
                    setActiveKey(index);
                    setFilters(list.filters);
                  }}
                >
                  {list.name}
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col span={16}>
          <Form
            layout="vertical"
            onFinish={(values) => {
              console.log(values.multi.format());
            }}
          >
            {filters?.map((filter, index) => (
              <FormItemInType key={index} type={filter.type} />
            ))}
            <Form.Item>
              <Button htmlType="submit">adsa</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default ReportList;
