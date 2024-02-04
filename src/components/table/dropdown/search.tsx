import { NewDatePicker, NewInput, NewInputNumber } from "@/components/input";
import { DataIndexType, ITool, Tool } from "@/service/entities";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { InputNumberProps, InputProps, Space } from "antd";
import PopoverTool from "./popover-tool";

const DateSearch: React.FC<{
  date: Dayjs;
  setDate: Dispatch<SetStateAction<Dayjs>>;
}> = ({ date, setDate }) => {
  return (
    <Space.Compact>
      <div className="extraButton">
        <PopoverTool
          dataIndexType={DataIndexType.DATE}
          operator={(tool) => {
            tool;
          }}
        />
      </div>
      <NewDatePicker
        style={{
          width: "100%",
        }}
        value={date}
        onChange={(date) => date && setDate(date)}
      />
      <div className="extraButton-right">
        <SearchOutlined onClick={() => console.log("it is working ")} />
      </div>
    </Space.Compact>
  );
};
const InputSearch: React.FC<InputProps> = (props) => (
  <NewInput
    {...props}
    style={{
      gap: 4,
    }}
    placeholder={"хайх..."}
  />
);
const NumberSearch: React.FC<InputNumberProps> = (props) => (
  <NewInputNumber
    {...props}
    style={{
      gap: 4,
      width: "100%",
    }}
    placeholder={"хайх"}
  />
);
interface IProps {
  type: DataIndexType;
  onChange?: (operator: Tool, value?: string | number | Dayjs) => void;
}
const DropdownSearch: React.FC<IProps> = ({ type, onChange }) => {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [inputValue, setInputValue] = useState<string>();
  const [inputNumberValue, setInputNumberValue] = useState<number>();
  const [tool, setTool] = useState<ITool>({
    logo: "/icons/tools/Equals.png",
    title: "Equals",
    operator: "EQUALS",
  });
  useEffect(() => {
    onChange?.(tool.operator, inputValue);
  }, [inputValue]);
  useEffect(() => {
    onChange?.(tool.operator, inputNumberValue);
  }, [inputNumberValue]);
  return (
    <div
      style={{
        padding: "12px 8px",
        backgroundColor: "#F8F9FA",
        borderRadius: 4,
        width: "100%",
      }}
    >
      {type == DataIndexType.DATE && (
        <DateSearch date={date} setDate={setDate} />
      )}
      {type == DataIndexType.MULTI && (
        <InputSearch
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          addonBefore={
            <PopoverTool
              dataIndexType={type}
              operator={(tool) => {
                setTool(tool);
              }}
            />
          }
        />
      )}
      {type == DataIndexType.NUMBER && (
        <NumberSearch
          value={inputNumberValue}
          onChange={(value) => setInputNumberValue(Number(value))}
          addonBefore={
            <PopoverTool
              dataIndexType={type}
              operator={(tool) => {
                setTool(tool);
              }}
            />
          }
        />
      )}
    </div>
  );
};
export default DropdownSearch;
