import { NewDatePicker, NewRangePicker } from "@/components/input";
import { FilterToolData } from "@/feature/data";
import { ITool, Tool } from "@/service/entities";
import { Button, Popover, Space } from "antd";
import { Dayjs } from "dayjs";
import Image from "next/image";
import { useState } from "react";
const operators: Tool[] = [
  "BETWEEN",
  "THAT",
  "IS_GREATER",
  "IS_GREATOR_OR_EQUAL",
  "IS_LESS",
  "IS_LESS_OR_EQUAL",
];
const tools: ITool[] = FilterToolData.filter((item) =>
  operators.includes(item.operator)
);
interface IProps {
  operator: Tool;
  setOperator: React.Dispatch<React.SetStateAction<Tool>>;
  startAt: Dayjs | null;
  setStartAt: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  endAt: Dayjs | null;
  setEndAt: React.Dispatch<React.SetStateAction<Dayjs | null>>;
}
export const ReportDateFilter: React.FC<IProps> = ({
  operator,
  setOperator,
  startAt,
  setStartAt,
  endAt,
  setEndAt,
}) => {
  const currentTool = tools.find((item) => item.operator === operator) || {
    logo: "/icons/tools/Calendar.svg",
    title: "Хооронд",
    operator: "BETWEEN",
  };
  const [isPopover, setIsPopover] = useState<boolean>(false);
  return (
    <Space.Compact>
      <div className="extraButton">
        <Popover
          open={isPopover}
          onOpenChange={setIsPopover}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {tools.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setOperator(item.operator);
                    setIsPopover(false);
                  }}
                  className="popupButton"
                  icon={
                    <Image
                      src={item.logo}
                      width={16}
                      height={16}
                      alt={item.title}
                    />
                  }
                >
                  {item.title}
                </Button>
              ))}
            </div>
          }
          title={currentTool?.title}
          trigger="click"
        >
          <Button
            icon={
              <Image
                src={currentTool.logo}
                alt={currentTool.title}
                width={16}
                height={16}
              />
            }
          />
        </Popover>
      </div>
      {operator == "BETWEEN" ? (
        <NewRangePicker
          value={[startAt, endAt]}
          onChange={(value) => {
            value?.[0] && setStartAt?.(value[0]);
            value?.[1] && setEndAt?.(value[1]);
          }}
        />
      ) : (
        <NewDatePicker
          value={startAt}
          onChange={(date) => {
            if (date && !Array.isArray(date)) {
              setStartAt?.(date);
            } else if (!date) {
              setStartAt?.(null);
            }
          }}
        />
      )}
    </Space.Compact>
  );
};
export default ReportDateFilter;
