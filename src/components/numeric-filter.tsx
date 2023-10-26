import { NumericFormat } from "react-number-format";
import { NewInputNumber, NewSelect } from "./input";
import { Form } from "antd";

export const ConditionNumeric = () => {
  return (
    <div>
      <Form.Item>
        <NewSelect
          options={[
            { value: "isGreator", label: "<" },
            { value: "", label: ">" },
            { value: "=", label: "=" },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <NumericFormat
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          displayType="input"
          customInput={NewInputNumber}
          suffix="₮"
        />
      </Form.Item>
    </div>
  );
};
