import { FilterToolData } from "@/feature/data";
import { DataIndexType, ITool, Operator, Tool } from "@/service/entities";
import { Popover } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const stringSearch: Tool[] = [
  "EQUALS",
  "NOT_EQUAL",
  "CONTAINS",
  "NOT_CONTAINS",
];
const numberSearch: Tool[] = [
  "EQUALS",
  "NOT_EQUAL",
  "IS_GREATER",
  "IS_GREATOR_OR_EQUAL",
  "IS_LESS",
  "IS_LESS_OR_EQUAL",
];
const dateSearch: Tool[] = [
  "THAT",
  "BETWEEN",
  "IS_LESS_OR_EQUAL",
  "IS_GREATOR_OR_EQUAL",
  "SELECTION",
  "YEAR",
  "QUARTER",
  "MONTH",
];
interface IProps {
  dataIndexType: DataIndexType;
  operator: (tool: ITool) => void;
}
const PopoverTool: React.FC<IProps> = ({ dataIndexType, operator }) => {
  const [newTools, setNewTools] = useState<ITool[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tool, setTool] = useState<ITool>(
    dataIndexType == DataIndexType.DATE
      ? {
          logo: "/icons/tools/Equals.png",
          title: "Тухайн",
          operator: "THAT",
        }
      : {
          logo: "/icons/tools/Equals.png",
          title: "Equals",
          operator: "EQUALS",
        }
  );
  useEffect(() => {
    if (dataIndexType == DataIndexType.MULTI) {
      setNewTools(
        FilterToolData.filter((item) => stringSearch.includes(item.operator))
      );
    } else if (dataIndexType == DataIndexType.DATE) {
      setNewTools(
        FilterToolData.filter((item) => dateSearch.includes(item.operator))
      );
    } else if (dataIndexType == DataIndexType.VALUE || DataIndexType.NUMBER) {
      setNewTools(
        FilterToolData.filter((item) => numberSearch.includes(item.operator))
      );
    }
  }, [dataIndexType]);
  useEffect(() => {
    operator(tool);
    setIsOpen(false);
  }, [tool]);
  return (
    <Popover
      placement="bottom"
      content={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {newTools.map((item, index) => (
            <button
              key={index}
              onClick={() => setTool(item)}
              className="popupButton"
            >
              <Image src={item.logo} width={16} height={16} alt={item.title} />
              <p
                style={{
                  color: "black",
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                {item.title}
              </p>
            </button>
          ))}
        </div>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={"click"}
    >
      <Image src={tool.logo} width={12} height={12} alt={tool.title} />
    </Popover>
  );
};
export default PopoverTool;
