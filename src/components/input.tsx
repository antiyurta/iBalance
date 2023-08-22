"use client";
import { ReactNode } from "react";
// date picker
import { Avatar, DatePicker, Input, Select, Switch } from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
// orogtgol
const { Option } = Select;
const { Search } = Input;

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
  return <Select {...props} />;
}
function NewOption(props: any) {
  return <Option {...props}>{props.children}</Option>;
}

function NewInput(props: any) {
  return <Input {...props}>{props.children}</Input>;
}

function NewSearch(props: any) {
  return <Search {...props}>{props.children}</Search>;
}
function NewSwitch(props: any) {
  return <Switch {...props} />;
}

export {
  NewAvatar,
  NewDatePicker,
  NewSelect,
  NewOption,
  NewInput,
  NewSearch,
  NewSwitch,
};
