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
  SwitchProps,
} from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import type { SelectProps } from "antd/es/select";
import type { InputProps } from "antd/es/input";
import type { PasswordProps } from "antd/es/input/Password";
import type { InputNumberProps } from "antd/es/input-number";
import type { TextAreaProps } from "antd/es/input/TextArea";
import type { SearchProps } from "antd/es/input/Search";
import type { CheckboxProps } from "antd/es/checkbox/Checkbox";
import locale from "antd/es/date-picker/locale/mn_MN";
import { CheckboxGroupProps } from "antd/es/checkbox";

const { RangePicker } = DatePicker;

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
  return (
    <DatePicker
      style={{
        width: "100%",
      }}
      locale={locale}
      {...props}
    />
  );
}

function NewRangePicker(props: RangePickerProps) {
  return <RangePicker {...props} />;
}

function NewSelect(props: SelectProps) {
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
      <Select {...props} />
    </ConfigProvider>
  );
}
function NewFilterSelect(props: SelectProps) {
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
      <Select
        {...props}
        allowClear
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? "")
            .toString()
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      />
    </ConfigProvider>
  );
}

function NewInput(props: InputProps) {
  return <Input {...props} />;
}

function NewInputPassword(props: PasswordProps) {
  return <Input.Password {...props} />;
}

function NewInputNumber(props: InputNumberProps) {
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

function NewTextArea(props: TextAreaProps) {
  return <TextArea {...props} />;
}

function NewSearch(props: SearchProps) {
  return <Search {...props}>{props.children}</Search>;
}
function NewSwitch(props: SwitchProps) {
  return <Switch {...props} />;
}

function NewRadioGroup(props: any) {
  return <Radio.Group {...props} />;
}

function NewRadio(props: any) {
  return <Radio {...props} />;
}

function NewCheckbox(props: CheckboxProps) {
  return <Checkbox {...props} />;
}

function NewCheckboxGroup(props: CheckboxGroupProps) {
  return <Checkbox.Group {...props} />;
}

export {
  NewAvatar,
  NewDatePicker,
  NewRangePicker,
  NewSelect,
  NewFilterSelect,
  NewInput,
  NewInputPassword,
  NewTextArea,
  NewSearch,
  NewSwitch,
  NewInputNumber,
  NewRadioGroup,
  NewRadio,
  NewCheckbox,
  NewCheckboxGroup,
};
