import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxProps } from "antd/lib";
import { useEffect, useState } from "react";
export interface ICheck {
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
}
interface IProps {
  title: string;
  isEdit?: boolean;
  onCheck: (value: ICheck) => void;
  defaultCheckedList: string[];
}
export const TreeInfo: React.FC<IProps> = ({ title, isEdit, onCheck, defaultCheckedList }) => {
  const options = [
    { label: "Нэмэх", value: "isAdd" },
    { label: "Засах", value: "isEdit" },
    { label: "Устгах", value: "isDelete" },
  ];
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);

  const checkAll = options.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? options.map((item) => item.value) : []);
  };
  useEffect(() => {
    const check: ICheck = {
      isAdd: Boolean(checkedList.find((item) => item == "isAdd")),
      isEdit: Boolean(checkedList.find((item) => item == "isEdit")),
      isDelete: Boolean(checkedList.find((item) => item == "isDelete")),
    };
    onCheck(check);
  }, [checkedList]);
  return (
    <div>
      <span
        style={{ fontWeight: "bold", minWidth: 300, display: "inline-block" }}
      >
        {title}
      </span>
      {isEdit && (
        <>
          <Checkbox
            indeterminate={indeterminate}
            onChange={(e) => onCheckAllChange(e)}
            checked={checkAll}
          >
            Бүгд сонгох
          </Checkbox>
          <Checkbox.Group
            options={options}
            value={checkedList}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
};
