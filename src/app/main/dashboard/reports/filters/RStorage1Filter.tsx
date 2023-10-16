import { NewDatePicker, NewRangePicker, NewSelect } from "@/components/input";
import { Form } from "antd";
import { useState } from "react";
import locale from "antd/es/date-picker/locale/mn_MN";
import "dayjs/locale/mn";
import { FormInstance } from "antd/lib";
import { NewMultipleDatePicker } from "@/components/multiDatePicker";

type ISelectValueType =
  | "that"
  | "between"
  | "until"
  | "late"
  | "selection"
  | "year"
  | "month"
  | "quarter";

interface IProps {
  form: FormInstance;
}

const RStorage1Filter = (props: IProps) => {
  const { form } = props;
  const [selectedValue, setSelectedValue] = useState<ISelectValueType>("that");
  const RenderDateFormItem = () => {
    if (
      selectedValue === "that" ||
      selectedValue === "until" ||
      selectedValue === "late"
    ) {
      return (
        <Form.Item label="Огноо сонгох" name="date">
          <NewDatePicker
            style={{
              width: "100%",
            }}
            locale={locale}
          />
        </Form.Item>
      );
    } else if (selectedValue === "between") {
      return (
        <Form.Item label="Огноо сонгох" name="dates">
          <NewRangePicker locale={locale} />
        </Form.Item>
      );
    } else if (
      selectedValue === "month" ||
      selectedValue === "quarter" ||
      selectedValue === "year"
    ) {
      return (
        <Form.Item label="Огноо сонгох" name="dates">
          <NewDatePicker picker={selectedValue} locale={locale} />
        </Form.Item>
      );
    } else if (selectedValue === "selection") {
      return (
        <Form.Item label="Огноо сонгох" name="multiDates">
          <NewMultipleDatePicker multiple />
        </Form.Item>
      );
    }
  };
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <Form.Item label={"Интерваль"} name="interval">
          <NewSelect
            style={{
              width: "100%",
            }}
            onChange={(value) => {
              setSelectedValue(value);
              form.resetFields(["date", "dates", "multiDates"]);
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
        <RenderDateFormItem />
        <Form.Item label="Нярав">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Байршил">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Барааний төрөл">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Бараа код, нэр">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Бренд">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
      </div>
    </>
  );
};
export default RStorage1Filter;
