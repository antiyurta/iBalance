"use client";
import { ReactNode } from "react";
// date picker
import {
  Avatar,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
} from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
// shalguur
const checkNumber = (event: any) => {
  var charCode = event.charCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault();
  } else {
    return true;
  }
};
// orogtgol
const { Option } = Select;
const { Search, TextArea } = Input;

interface IAvatar {
  size: number;
  src?: string | ReactNode;
}

function NewAvatar(props: IAvatar) {
  return <Avatar {...props} />;
}

function NewDatePicker(props: DatePickerProps) {
  return <DatePicker {...props} />;
}

function NewSelect(props: any) {
  return (
    <ConfigProvider
      renderEmpty={() => (
        <div
          style={{
            margin: "6px 12px",
          }}
        >
          Дата байхгүй
        </div>
      )}
    >
      <Select {...props}></Select>
    </ConfigProvider>
  );
}
function NewOption(props: any) {
  return <Option {...props}>{props.children}</Option>;
}

function NewInput(props: any) {
  return <Input {...props}>{props.children}</Input>;
}

function NewInputNumber(props: any) {
  return (
    <InputNumber
      onKeyPress={checkNumber}
      formatter={(value: any) =>
        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "")
      }
      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
      {...props}
    >
      {props.children}
    </InputNumber>
  );
}

function NewTextArea(props: any) {
  return <TextArea {...props} />;
}

function NewSearch(props: any) {
  return <Search {...props}>{props.children}</Search>;
}
function NewSwitch(props: any) {
  return <Switch {...props} />;
}

function NewRadioGroup(props: any) {
  return <Radio.Group {...props} />;
}

function NewRadio(props: any) {
  return <Radio {...props} />;
}

function NewCheckbox(props: any) {
  return <Checkbox {...props} />;
}

function NewCheckboxGroup(props: any) {
  return <Checkbox.Group {...props} />;
}

export {
  NewAvatar,
  NewDatePicker,
  NewSelect,
  NewOption,
  NewInput,
  NewTextArea,
  NewSearch,
  NewSwitch,
  NewInputNumber,
  NewRadioGroup,
  NewRadio,
  NewCheckbox,
  NewCheckboxGroup,
};
