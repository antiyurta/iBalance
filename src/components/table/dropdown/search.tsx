import { NewDatePicker, NewInput, NewInputNumber } from "@/components/input";
import { DataIndexType, ITool } from "@/service/entities";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Popover, Space } from "antd";
import Tools from "./tools";
import Image from "next/image";

interface IProps {
  type: DataIndexType;
}
let tool: ITool = {
  logo: "/icons/tools/Equals.png",
  title: "Equals",
  operator: "EQUALS",
};
let stringSearch: string | undefined;
let numberSearch: number | undefined;
const DateSearch: React.FC<{
  date: Dayjs;
  setDate: Dispatch<SetStateAction<Dayjs>>;
}> = ({ date, setDate }) => {
  return (
    <Space.Compact>
      <div className="extraButton">
        <Popover
          placement="bottom"
          content={
            <Tools
              dataIndexType={DataIndexType.DATE}
              operator={(value) => (tool = value)}
            />
          }
          trigger={"click"}
        >
          <Image src={tool.logo} width={12} height={12} alt={tool.title} />
        </Popover>
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
const InputSearch: React.FC = () => (
  <NewInput
    style={{
      gap: 4,
    }}
    value={stringSearch}
    onChange={(e) => {
      stringSearch = e.target.value;
    }}
    addonBefore={
      <Popover
        placement="bottom"
        content={
          <Tools
            dataIndexType={DataIndexType.MULTI}
            operator={(value) => (tool = value)}
          />
        }
        trigger={"click"}
      >
        <Image src={tool.logo} width={12} height={12} alt={tool.title} />
      </Popover>
    }
    placeholder={"хайх..."}
  />
);
const NumberSearch: React.FC = () => (
  <NewInputNumber
    style={{
      gap: 4,
      width: "100%",
    }}
    value={numberSearch}
    onChange={(value) => (numberSearch = Number(value))}
    addonBefore={
      <Popover
        placement="bottom"
        content={
          <Tools
            dataIndexType={DataIndexType.NUMBER}
            operator={(value) => (tool = value)}
          />
        }
        trigger={"click"}
      >
        <Image src={tool.logo} width={12} height={12} alt="searchIcon" />
      </Popover>
    }
    placeholder={"хайх"}
  />
);

const DropdownSearch: React.FC<IProps> = ({ type }) => {
  const [date, setDate] = useState<Dayjs>(dayjs());
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
      {type == DataIndexType.MULTI && <InputSearch />}
      {type == DataIndexType.NUMBER && <NumberSearch />}
    </div>
  );
};
export default DropdownSearch;
