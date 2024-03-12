import { useEffect, useState } from "react";
import {
  DataIndexType,
  FilterValueType,
  IFilter,
  Operator,
  Tool,
  TypeCheck,
} from "@/service/entities";
import { getParam } from "@/feature/common";
import Sorter from "./sorter";
import DropdownSearch from "./search";
import DropdownTitle from "./title";
import CheckboxGroup from "./checkbox-group";
import { useTypedSelector } from "@/feature/store/reducer";
import { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { NumericFormat } from "react-number-format";
import { changeParam } from "@/feature/store/slice/param.slice";

interface IProps {
  label: string;
  dataIndex: string[];
  type: DataIndexType;
  filters: TypeCheck[];
  isFiltered: boolean;
  handleSearch: (params: object, state: boolean) => void;
}

const NewDropdown = (props: IProps) => {
  const {
    label,
    dataIndex,
    type,
    filters = [],
    isFiltered,
    handleSearch,
  } = props;
  const [checkboxes, setCheckboxes] = useState<TypeCheck[]>(filters);
  const [newFilters, setNewFilters] = useState<IFilter[]>([]);
  const [isClear, setIsClear] = useState<boolean>(false);
  const { activeKey, items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, activeKey);
  const dispatch = useDispatch<AppDispatch>();
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const updateFilter = (operator: Tool, filter: FilterValueType): IFilter[] => {
    const updatedFilters = [...newFilters];
    const existingIndex = updatedFilters.findIndex(
      (item) => JSON.stringify(item.dataIndex) === JSON.stringify(dataIndex)
    );
    if (existingIndex == -1) {
      return [...updatedFilters, { dataIndex, operator, filter }];
    } else {
      updatedFilters[existingIndex] = { dataIndex, operator, filter };
      return updatedFilters;
    }
  };
  const search = () => {
    dispatch(
      changeParam({
        ...param,
        filters: newFilters,
        page: 1,
        limit: 10,
      })
    );
    handleSearch({}, false);
  };
  const filterCheckbox = (
    type: DataIndexType,
    operator: Tool,
    value?: string | number | Dayjs[]
  ): TypeCheck[] => {
    if (!value || Array.isArray(value)) {
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
  useEffect(() => {
    console.log("filters =====>", filters);
    // setCheckboxes(filters);
  }, [filters]);
  useEffect(() => {
    console.log("checkboxes =======>", checkboxes);
  }, [checkboxes]);
  useEffect(() => {
    setNewFilters(updateFilter("IN", checkedList));
  }, [checkedList]);
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
            if (
              (value && Array.isArray(value)) ||
              type == (DataIndexType.DATE || DataIndexType.DATETIME)
            ) {
              {
                setNewFilters(updateFilter(operator, value as Dayjs[]));
              }
            }
          }}
        />
        {type != (DataIndexType.DATE || DataIndexType.DATETIME) && (
          <CheckboxGroup
            options={checkboxes.map((item) => {
              if (typeof item == "object") {
                return { value: item.value, label: item.label };
              } else if (typeof item == "boolean") {
                if (type == DataIndexType.BOOLEAN_STRING)
                  return { value: item, label: item ? "Идэвхтэй" : "Идэвхгүй" };
                else return { value: item, label: item ? "Тийм" : "Үгүй" };
              } else if (typeof item == "number") {
                return {
                  value: item,
                  label: (
                    <NumericFormat
                      value={item}
                      thousandSeparator=","
                      displayType="text"
                    />
                  ),
                };
              } else return { value: item, label: item };
            })}
            isClear={isClear}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
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
          onClick={() => setIsClear(!isClear)}
          className="app-button-regular"
          style={{
            color: "#198754",
          }}
        >
          Цэвэрлэх
        </button>
        <button
          onClick={() => search()}
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
