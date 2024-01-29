import { useEffect, useState } from "react";
import {
  DataIndexType,
  IParam,
  ITool,
  RadioType,
  Tool,
  ToolsIcons,
} from "@/service/entities";
import { typeOfFilters } from "@/feature/common";
import Sorter from "./sorter";
import DropdownSearch from "./search";
import DropdownTitle from "./title";
import CheckboxGroup from "./checkbox-group";
import { useRouter } from "next/navigation";
import { useTypedSelector } from "@/feature/store/reducer";
import { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam } from "@/feature/store/slice/tab.slice";
import { CheckboxValueType } from "antd/es/checkbox/Group";

interface IProps {
  label: string;
  dataIndex: string[];
  type: DataIndexType;
  filters: TypeCheck[];
  isFiltered: boolean;
  handleSearch: (params: object, state: boolean) => void;
}
type TypeCheck = number | string | boolean;

const NewDropdown = (props: IProps) => {
  const { label, dataIndex, type, filters, isFiltered, handleSearch } = props;
  const [checkboxes, setCheckboxes] = useState<TypeCheck[]>(filters);
  const [isClear, setIsClear] = useState<boolean>(false);
  const clearFilter = () => {
    setIsClear(!isClear);
    handleSearch({}, false);
  };

  const filterCheckbox = (
    type: DataIndexType,
    operator: Tool,
    value?: string | number | Dayjs
  ): TypeCheck[] => {
    if (!value || type == DataIndexType.DATE) {
      return filters;
    } else {
      if (operator == "CONTAINS") {
        return filters.filter((item) =>
          item.toString().toLowerCase().includes(value.toString().toLowerCase())
        );
      } else if (operator == "EQUALS") {
        return filters.filter((item) => item == value.toString());
      } else if (operator == "IS_GREATER" && typeof value == "number") {
        return filters.filter((item) => Number(item) > value);
      } else if (
        operator == "IS_GREATOR_OR_EQUAL" &&
        typeof value == "number"
      ) {
        return filters.filter((item) => Number(item) >= value);
      } else if (operator == "IS_LESS" && typeof value == "number") {
        return filters.filter((item) => Number(item) < value);
      } else if (operator == "IS_LESS_OR_EQUAL" && typeof value == "number") {
        return filters.filter((item) => Number(item) <= value);
      } else return filters;
    }
  };
  return (
    <div
      style={{
        display: "flex",
        padding: 16,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        borderRadius: 8,
        background: "white",
        boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.15)",
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          width: 248,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <DropdownTitle>Эрэмбэлэх</DropdownTitle>
        <Sorter dataIndex={dataIndex} />
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#DEE2E6",
          }}
        />
        <DropdownTitle>Хайх</DropdownTitle>
        <DropdownSearch
          type={type}
          onChange={(operator, value) => {
            setCheckboxes(filterCheckbox(type, operator, value));
          }}
        />
        {type != (DataIndexType.DATE || DataIndexType.DATETIME) && (
          <CheckboxGroup
            dataIndex={dataIndex}
            options={checkboxes.map((item) => ({
              value: String(item),
              label: String(item),
            }))}
            isClear={isClear}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 20,
          alignSelf: "stretch",
        }}
      >
        <button
          onClick={() => clearFilter()}
          className="app-button-regular"
          style={{
            color: "#198754",
          }}
        >
          Цэвэрлэх
        </button>
        <button
          onClick={() => {
            handleSearch({}, false);
          }}
          className="app-button-regular"
          style={{
            color: "white",
            backgroundColor: "#198754",
            border: "1px solid #198754",
          }}
        >
          Хайх
        </button>
      </div>
    </div>
  );
};
export default NewDropdown;
