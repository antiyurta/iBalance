import { NewCheckbox, NewCheckboxGroup } from "@/components/input";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
interface Option {
  label: ReactNode;
  value: any;
}
interface IProps {
  options: Option[];
  isClear: boolean;
  checkedList: any[];
  setCheckedList: Dispatch<SetStateAction<any[]>>;
}
const CheckboxGroup: React.FC<IProps> = ({
  options,
  isClear,
  checkedList,
  setCheckedList,
}) => {
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);

  const handleCheckboxChange = (checkedValues: any[]) => {
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
