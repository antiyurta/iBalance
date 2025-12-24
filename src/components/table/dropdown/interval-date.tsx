import { NewDatePicker, NewRangePicker } from "@/components/input";
import { DataIndexType, ITool, Tool } from "@/service/entities";
import { Space } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import PopoverTool from "./popover-tool";
import { Dayjs } from "dayjs";
import DatePicker from "react-multi-date-picker";
const datePickers: Tool[] = ["THAT", "IS_GREATOR_OR_EQUAL", "IS_LESS_OR_EQUAL"];
const groupPickers: Tool[] = ["MONTH", "QUARTER", "YEAR"];
interface IProps {
  tool: ITool;
  setTool: Dispatch<SetStateAction<ITool>>;
  dates: Dayjs[];
  setDates: Dispatch<SetStateAction<Dayjs[]>>;
}
export const IntervalDate: React.FC<IProps> = ({
  tool,
  setTool,
  dates,
  setDates,
}) => {
  return (
    <Space.Compact>
      <div className="extraButton">
        <PopoverTool
          dataIndexType={DataIndexType.DATE}
          tool={tool}
          setTool={setTool}
        />
      </div>
      {datePickers.includes(tool.operator) && (
        <NewDatePicker
          value={dates && dates[0]}
          onChange={(date) =>
            date ? setDates(Array.isArray(date) ? date : [date]) : setDates([])
          }
        />
      )}
      {tool.operator == "BETWEEN" && (
        <NewRangePicker
          value={dates && [dates[0], dates[1]]}
          onChange={(date: any) =>
            setDates(Array.isArray(date) ? date : [date])
          }
        />
      )}
      {groupPickers.includes(tool.operator) && (
        <NewDatePicker
          picker={datePickerMode(tool.operator)}
          value={dates && dates[0]}
          onChange={(date) =>
            date ? setDates(Array.isArray(date) ? date : [date]) : setDates([])
          }
        />
      )}
      {tool.operator == "SELECTION" && (
        <DatePicker multiple onChange={(date: any) => setDates(date)} />
      )}
    </Space.Compact>
  );
};
const datePickerMode = (
  operator: Tool
): "year" | "month" | "quarter" | undefined => {
  if (operator == "YEAR") return "year";
  else if (operator == "MONTH") return "month";
  else if (operator == "QUARTER") return "quarter";
  else return undefined;
};
