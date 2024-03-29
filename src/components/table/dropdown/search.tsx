import { NewInput, NewInputNumber } from "@/components/input";
import { DataIndexType, ITool, Tool } from "@/service/entities";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { InputNumberProps, InputProps } from "antd";
import PopoverTool from "./popover-tool";
import { IntervalDate } from "./interval-date";
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
  onChange?: (operator: Tool, value?: string | number | Dayjs[]) => void;
}
const DropdownSearch: React.FC<IProps> = ({ type, onChange }) => {
  const getDefaultTool = (): ITool => {
    if (type == DataIndexType.DATE || type == DataIndexType.DATETIME) {
      return {
        logo: "/icons/tools/Equals.png",
        title: "Тухайн",
        operator: "THAT",
      };
    } else if (type == DataIndexType.MULTI) {
      return {
        logo: "/icons/tools/Contains.png",
        title: "Агуулсан",
        operator: "CONTAINS",
      };
    } else {
      return {
        logo: "/icons/tools/Equals.png",
        title: "Equals",
        operator: "EQUALS",
      };
    }
  };
  const [dates, setDates] = useState<Dayjs[]>([dayjs(new Date())]);
  const [inputValue, setInputValue] = useState<string>();
  const [inputNumberValue, setInputNumberValue] = useState<number>();
  const [tool, setTool] = useState<ITool>(getDefaultTool());
  useEffect(() => {
    onChange?.(tool.operator, inputValue);
  }, [inputValue]);
  useEffect(() => {
    onChange?.(tool.operator, inputNumberValue);
  }, [inputNumberValue]);
  useEffect(() => {
    onChange?.(tool.operator, dates);
  }, [tool, dates]);
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
        <IntervalDate
          tool={tool}
          setTool={setTool}
          dates={dates}
          setDates={setDates}
        />
      )}
      {type == DataIndexType.MULTI && (
        <InputSearch
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          addonBefore={
            <PopoverTool dataIndexType={type} tool={tool} setTool={setTool} />
          }
        />
      )}
      {(type == DataIndexType.NUMBER || type == DataIndexType.VALUE) && (
        <NumberSearch
          value={inputNumberValue}
          onChange={(value) => setInputNumberValue(Number(value))}
          addonBefore={
            <PopoverTool dataIndexType={type} tool={tool} setTool={setTool} />
          }
        />
      )}
    </div>
  );
};
export default DropdownSearch;
