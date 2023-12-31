import type { CalendarProps, DatePickerProps } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";
export const NewMultipleDatePicker = (
  props: Omit<CalendarProps, "onChange"> & DatePickerProps
) => {
  return (
    <DatePicker
      style={{
        height: 36,
        width: "100%",
      }}
      {...props}
      highlightToday={false}
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
