import { NewCheckbox, NewCheckboxGroup } from "@/components/input";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useState } from "react";
interface Option {
  label: string;
  value: string;
}
interface IProps {
  options: Option[];
}
const CheckboxGroup: React.FC<IProps> = ({ options }) => {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedList(checkedValues);
    setIndeterminate(
      !!checkedValues.length && checkedValues.length < options.length
    );
    setCheckAll(checkedValues.length === options.length);
  };
  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(
      e.target.checked ? options.map((option) => option.value) : []
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
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
        onChange={handleCheckAllChange}
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
