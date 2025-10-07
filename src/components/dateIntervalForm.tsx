import { CSSProperties, useState } from "react";
import { FormInstance } from "antd/lib";
import { Form, Select, Space } from "antd";
import { NewDatePicker, NewRangePicker, NewSelect } from "./input";
import locale from "antd/es/date-picker/locale/mn_MN";
import { NewMultipleDatePicker } from "./multiDatePicker";
import { ISelectDateType } from "@/service/entities";
interface IProps {
  intervalStyle?: CSSProperties;
  dateStyle?: CSSProperties;
  form: FormInstance;
  itemname: string;
  label?: string;
  labelForDate?: string;
}

const DateIntervalForm = (props: IProps) => {
  const { form, intervalStyle, dateStyle, itemname, label, labelForDate } =
    props;
  const [selectedValue, setSelectedValue] = useState<ISelectDateType>("that");

  const RenderDateFormItem = () => {
    if (
      selectedValue === "that" ||
      selectedValue === "until" ||
      selectedValue === "late"
    ) {
      return (
        <Form.Item
          style={dateStyle}
          label={labelForDate ? labelForDate : "Огноо сонгох"}
          name={[itemname, "date"]}
        >
          <NewDatePicker />
        </Form.Item>
      );
    } else if (selectedValue === "between") {
      return (
        <Form.Item
          style={dateStyle}
          label={labelForDate ? labelForDate : "Огноо сонгох"}
          name={[itemname, "dates"]}
        >
          <NewRangePicker
            style={{
              width: "100%",
            }}
            locale={locale}
          />
        </Form.Item>
      );
    } else if (
      selectedValue === "month" ||
      selectedValue === "quarter" ||
      selectedValue === "year"
    ) {
      return (
        <Form.Item
          style={dateStyle}
          label={labelForDate ? labelForDate : "Огноо сонгох"}
          name={[itemname, "date"]}
        >
          <NewDatePicker picker={selectedValue} locale={locale} />
        </Form.Item>
      );
    } else if (selectedValue === "selection") {
      return (
        <Form.Item
          style={dateStyle}
          label={labelForDate ? labelForDate : "Огноо сонгох"}
          name={[itemname, "dates"]}
        >
          <NewMultipleDatePicker />
        </Form.Item>
      );
    }
  };
  return (
    <>
      <Form.Item
        style={intervalStyle}
        label={label ? label : "Интерваль"}
        name={[itemname, "interval"]}
      >
        <NewSelect
          style={{
            width: "100%",
          }}
          allowClear
          onChange={(value) => {
            setSelectedValue(value);
            form.resetFields(["date", "dates"]);
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
    </>
  );
};
export default DateIntervalForm;
