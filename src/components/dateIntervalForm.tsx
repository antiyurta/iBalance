import { CSSProperties, useState } from "react";
import { FormInstance } from "antd/lib";
import { Form } from "antd";
import { NewDatePicker, NewRangePicker, NewSelect } from "./input";
import locale from "antd/es/date-picker/locale/mn_MN";
import { NewMultipleDatePicker } from "./multiDatePicker";
interface IProps {
  customStyle: {
    intervalStyle?: CSSProperties;
    dateStyle?: CSSProperties;
  };
  form: FormInstance;
}

type ISelectValueType =
  | "that"
  | "between"
  | "until"
  | "late"
  | "selection"
  | "year"
  | "month"
  | "quarter";

const DateIntervalForm = (props: IProps) => {
  const {
    form,
    customStyle: { intervalStyle, dateStyle },
  } = props;
  const [selectedValue, setSelectedValue] = useState<ISelectValueType>("that");
  const RenderDateFormItem = () => {
    if (
      selectedValue === "that" ||
      selectedValue === "until" ||
      selectedValue === "late"
    ) {
      return (
        <Form.Item style={dateStyle} label="Огноо сонгох" name="date">
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
        <Form.Item style={dateStyle} label="Огноо сонгох" name="dates">
          <NewRangePicker locale={locale} />
        </Form.Item>
      );
    } else if (
      selectedValue === "month" ||
      selectedValue === "quarter" ||
      selectedValue === "year"
    ) {
      return (
        <Form.Item style={dateStyle} label="Огноо сонгох" name="dates">
          <NewDatePicker picker={selectedValue} locale={locale} />
        </Form.Item>
      );
    } else if (selectedValue === "selection") {
      return (
        <Form.Item style={dateStyle} label="Огноо сонгох" name="multiDates">
          <NewMultipleDatePicker multiple />
        </Form.Item>
      );
    }
  };
  return (
    <>
      <Form.Item style={intervalStyle} label={"Интерваль"} name="interval">
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
    </>
  );
};
export default DateIntervalForm;
