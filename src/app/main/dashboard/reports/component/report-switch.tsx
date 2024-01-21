import { NewCheckbox } from "@/components/input";
import { Form } from "antd";
import React from "react";
interface IProps {
  label: string;
  name: string;
}
const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
export const NewReportSwitch: React.FC<IProps> = ({
  label,
  name,
}) => {
  return (
    <Form.Item name={name} valuePropName="checked" {...tailFormItemLayout}>
      <NewCheckbox>{label}</NewCheckbox>
    </Form.Item>
  );
};
