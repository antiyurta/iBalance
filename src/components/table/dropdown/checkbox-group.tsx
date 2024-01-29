import { NewCheckbox, NewCheckboxGroup } from "@/components/input";
import { useTypedSelector } from "@/feature/store/reducer";
import { changeParam } from "@/feature/store/slice/tab.slice";
import { AppDispatch } from "@/feature/store/store";
import { IFilter, Operator } from "@/service/entities";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
interface Option {
  label: string;
  value: string;
}
interface IProps {
  dataIndex: string[];
  options: Option[];
  isClear: boolean;
}
const CheckboxGroup: React.FC<IProps> = ({ dataIndex, options, isClear }) => {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTab = tabItems.find((item) => item.key == activeKey);
  const dispatch = useDispatch<AppDispatch>();

  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedList(checkedValues);
    setIndeterminate(
      !!checkedValues.length && checkedValues.length < options.length
    );
    setCheckAll(checkedValues.length === options.length);
  };
  const handleCheckAllChange = (value: boolean) => {
    setCheckedList(value ? options.map((option) => option.value) : []);
    setIndeterminate(false);
    setCheckAll(value);
  };
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
  useEffect(() => {
    if (currentTab) {
      const { filters } = currentTab.param;
      const newFilters = addOrUpdateFilter(dataIndex, checkedList, filters);
      dispatch(
        changeParam({
          ...currentTab.param,
          filters: newFilters,
        })
      );
    }
  }, [checkedList]);
  useEffect(() => {
    handleCheckAllChange(false);
  }, [isClear]);
  return (
    <div
      style={{
        padding: "12px 8px",
        backgroundColor: "#F8F9FA",
        borderRadius: 4,
        width: "100%",
      }}
    >
      <NewCheckbox
        indeterminate={indeterminate}
        onChange={(e) => handleCheckAllChange(e.target.checked)}
        checked={checkAll}
      >
        Бүгд сонгох
      </NewCheckbox>
      <div
        style={{
          paddingLeft: 20,
          height: 140,
          overflow: "auto",
        }}
      >
        <NewCheckboxGroup
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          options={options}
          value={checkedList}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};
export default CheckboxGroup;
