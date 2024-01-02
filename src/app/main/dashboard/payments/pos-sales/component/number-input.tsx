import { NewInput } from "@/components/input";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
interface iProps {
    iValue: (value: number) => void;
}
const NumberInput = (props: iProps) => {
    const { iValue } = props;
  const [value, setValue] = useState<number>(0);
  const onChange = (ivalue: number) => {
    if (value + ivalue > 0) {
      setValue(ivalue);
    }
  };
  useEffect(() => iValue(value), [value]);
  return (
    <NewInput
      style={{
        width: 170,
      }}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      addonBefore={
        value > 0 ? <MinusOutlined onClick={() => onChange(value - 1)} /> : null
      }
      addonAfter={<PlusOutlined onClick={() => onChange(value + 1)} />}
    />
  );
};
export default NumberInput;
