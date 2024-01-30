import { useEffect, useState } from "react";
import {
  DataIndexType,
  IFilter,
  IParam,
  ITool,
  Operator,
  Tool,
  TypeCheck,
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
import { NumericFormat } from "react-number-format";

interface IProps {
  label: string;
  dataIndex: string[];
  type: DataIndexType;
  filters: TypeCheck[];
  isFiltered: boolean;
  handleSearch: (params: object, state: boolean) => void;
}

const NewDropdown = (props: IProps) => {
  const { label, dataIndex, type, filters, isFiltered, handleSearch } = props;
  const [checkboxes, setCheckboxes] = useState<TypeCheck[]>(filters || []);
  const [isClear, setIsClear] = useState<boolean>(false);
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTab = tabItems.find((item) => item.key == activeKey);
  const dispatch = useDispatch<AppDispatch>();
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const addOrUpdateFilter = (
    dataIndex: string[],
    filterValue: CheckboxValueType[],
    filters: IFilter[]
  ) => {
    // dataIndex талбарын утгыг шалгана
    const existingFilterIndex = filters.findIndex(
      (filter) => JSON.stringify(filter.dataIndex) === JSON.stringify(dataIndex)
    );

    if (existingFilterIndex !== -1) {
      if (filterValue.length == 0) {
        return filters.filter((_, index) => index !== existingFilterIndex);
      } else {
        // dataIndex талбарын утгын өөрчлөлтөөр тодорхойлсон фильтрийг шинэчилнэ
        return filters.map((filter, index) =>
          index === existingFilterIndex
            ? { ...filter, operator: Operator.In, filter: filterValue }
            : filter
        );
      }
    } else {
      // dataIndex талбарын утгыг ашиглан шинэ фильтрийг үүсгэнэ
      return [
        ...filters,
        { dataIndex: dataIndex, operator: Operator.In, filter: filterValue },
      ];
    }
  };
  const search = () => {
    if (currentTab) {
      const { filters } = currentTab.param;
      // console.log("filters =====>", filters);
      const newFilters = addOrUpdateFilter(
        dataIndex,
        checkedList,
        filters || []
      );
      console.log('newFilters =====>', newFilters);
      dispatch(
        changeParam({
          ...currentTab.param,
          filters: newFilters,
          page: 1,
          limit: 10,
        })
      );
    }
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
  // useEffect(() => {
  //   if (
  //     currentTab &&
  //     currentTab.param.filters &&
  //     currentTab.param.filters.length > 0
  //   ) {
  //     const filter = currentTab.param.filters.find(
  //       (item) => JSON.stringify(item.dataIndex) === JSON.stringify(dataIndex)
  //     );
  //     console.log("filter ======>", filter?.filter);
  //     // setCheckedList(filter?.filter as CheckboxValueType[]);
  //   }
  // }, []);
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
