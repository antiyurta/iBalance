import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxProps } from "antd/lib";
import { useState } from "react";
interface IProps {
  title: string;
  isEdit?: boolean;
}
export const TreeInfo: React.FC<IProps> = ({ title, isEdit }) => {
  const options = [
    { label: "Нэмэх", value: "isAdd" },
    { label: "Засах", value: "isEdit" },
    { label: "Устгах", value: "isDelete" },
  ];
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

  const checkAll = options.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? options.map((item) => item.value) : []);
  };
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
