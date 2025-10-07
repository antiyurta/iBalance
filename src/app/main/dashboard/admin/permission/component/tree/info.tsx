import { IDataPermission } from "@/service/permission/entities";
import { Checkbox } from "antd";
// import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxProps } from "antd/lib";
import { useEffect, useState } from "react";
interface IProps {
  title: string;
  isEdit?: boolean;
  onCheck: (value: IDataPermission) => void;
  permission?: IDataPermission;
}
export const TreeInfo: React.FC<IProps> = ({
  title,
  isEdit,
  onCheck,
  permission,
}) => {
  const options = [
    { label: "Нэмэх", value: "isAdd" },
    { label: "Засах", value: "isEdit" },
    { label: "Устгах", value: "isDelete" },
  ];
  const defaultValues = [];
  if (permission) {
    permission.isAdd == true && defaultValues.push("isAdd");
    permission.isEdit == true && defaultValues.push("isEdit");
    permission.isDelete == true && defaultValues.push("isDelete");
  }
  const [checkedList, setCheckedList] = useState(defaultValues);
  const checkAll = options.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const onChange = (list: any) => {
    setCheckedList(list);
  };
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? options.map((item) => item.value) : []);
  };
  useEffect(() => {
    if (permission) {
      permission.isAdd = checkedList.includes("isAdd");
      permission.isEdit = checkedList.includes("isEdit");
      permission.isDelete = checkedList.includes("isDelete");
      onCheck(permission);
    }
  }, [permission, checkedList]);
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
