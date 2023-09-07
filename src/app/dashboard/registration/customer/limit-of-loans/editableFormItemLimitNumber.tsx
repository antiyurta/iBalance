import * as React from "react";
import { Form } from "antd";
import { FormItemProps } from "antd/lib/form";
import { NumericFormat } from "react-number-format";

interface EditableFormItemProps extends FormItemProps {
  readonly editing: boolean;
}

export const EditableFormItemLimitNumber: React.FC<EditableFormItemProps> = (
  props
) => {
  const { editing, ...rest } = props;
  return (
    <Form.Item {...rest}>{editing ? props.children : <Dummy />}</Form.Item>
  );
};

interface DummyProps {
  readonly value?: any;
}

const Dummy: React.FC<DummyProps> = (props) => (
  <div style={{ paddingLeft: 12, textAlign: "end" }}>
    <NumericFormat
      value={props.value}
      thousandSeparator=","
      decimalScale={2}
      fixedDecimalScale
      displayType="text"
    />
  </div>
);
