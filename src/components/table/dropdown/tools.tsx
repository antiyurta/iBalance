import { DataIndexType, ITool } from "@/service/entities";
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
const Tools: React.FC<IProps> = ({ dataIndexType, operator }) => {
  const [newTools, setNewTools] = useState<ITool[]>(tools);
  useEffect(() => {
    if (dataIndexType == DataIndexType.MULTI) {
      setNewTools(
        tools.filter(
          (item) =>
            item.operator ==
            ("EQUALS" || "NOT_EQUAL" || "CONTAINS" || "NOT_CONTAINS")
        )
      );
    }
  }, [dataIndexType]);
  return (
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
          onClick={() => operator(item)}
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
  );
};
export default Tools;