import type { CalendarProps, DatePickerProps } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";
import { CalendarOutlined } from "@ant-design/icons";
import { NewInput } from "./input";
export const NewMultipleDatePicker = (
  props: Omit<CalendarProps, "onChange"> & DatePickerProps
) => {
  function CustomInput({ onFocus, value, onChange }: any) {
    return <input onFocus={onFocus} value={value} onChange={onChange} />;
  }
  return (
    <DatePicker
      style={{
        height: 36,
      }}
      {...props}
      render={<NewInput suffix={<CalendarOutlined />} />}
      weekDays={["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"]}
      months={[
        "1 сар",
        "2 сар",
        "3 сар",
        "4 сар",
        "5 сар",
        "6 сар",
        "7 сар",
        "8 сар",
        "9 сар",
        "10 сар",
        "11 сар",
        "12 сар",
      ]}
    />
  );
};
