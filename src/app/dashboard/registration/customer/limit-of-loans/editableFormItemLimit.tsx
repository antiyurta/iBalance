import * as React from "react";
import { Form } from "antd";
import { FormItemProps } from "antd/lib/form";

interface EditableFormItemProps extends FormItemProps {
  readonly editing: boolean;
}

export const EditableFormItemLimit: React.FC<EditableFormItemProps> = (
  props
) => {
  const { editing, ...rest } = props;
  console.log("========>", props.children);
  return (
    <Form.Item {...rest}>{editing ? props.children : <Dummy />}</Form.Item>
  );
};

interface DummyProps {
  readonly value?: any;
}

const Dummy: React.FC<DummyProps> = (props) => {
  console.log(props.value);
  return "sdada";
  // return <div style={{ paddingLeft: 12 }}>{props.value}</div>;
};
