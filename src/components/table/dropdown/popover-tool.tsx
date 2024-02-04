import { DataIndexType, ITool } from "@/service/entities";
import { Popover } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface IProps {
  dataIndexType: DataIndexType;
  operator: (tool: ITool) => void;
}

const tools: ITool[] = [
  {
    logo: "/icons/tools/Equals.png",
    title: "Equals",
    operator: "EQUALS",
  },
  {
    logo: "/icons/tools/notEquals.png",
    title: "Does not equals",
    operator: "NOT_EQUAL",
  },
  {
    logo: "/icons/tools/Contains.png",
    title: "Contains",
    operator: "CONTAINS",
  },
  {
    logo: "/icons/tools/notContains.png",
    title: "Does Not Contain",
    operator: "NOT_CONTAINS",
  },
  {
    logo: "/icons/tools/isGreetThan.png",
    title: "Is greater than",
    operator: "IS_GREATER",
  },
  {
    logo: "/icons/tools/isGreetThanOrEqual.png",
    title: "Is greater than or equal to",
    operator: "IS_GREATER",
  },
  {
    logo: "/icons/tools/isLessThan.png",
    title: "Is less than",
    operator: "IS_LESS",
  },
  {
    logo: "/icons/tools/isLessThanOrEqual.png",
    title: "Is less than equal to",
    operator: "IS_LESS_OR_EQUAL",
  },
];
const PopoverTool: React.FC<IProps> = ({ dataIndexType, operator }) => {
  const [newTools, setNewTools] = useState<ITool[]>(tools);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tool, setTool] = useState<ITool>({
    logo: "/icons/tools/Equals.png",
    title: "Equals",
    operator: "EQUALS",
  });
  useEffect(() => {
    if (dataIndexType == DataIndexType.MULTI) {
      setNewTools(
        tools.filter(
          (item) =>
            item.operator === "EQUALS" ||
            item.operator === "NOT_EQUAL" ||
            item.operator === "CONTAINS" ||
            item.operator === "NOT_CONTAINS"
        )
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
