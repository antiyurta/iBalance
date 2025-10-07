import { TreeSelect } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { TreeSelectProps } from "antd/lib";
import { useEffect, useState } from "react";
interface IData {
  id: number;
  sectionId: number | null;
  name: string;
  isExpand: boolean;
  sections: IData[];
}
interface IProps {
  sections: IData[];
  onChange: (value: string) => void;
  disabled?: boolean;
}
const NewTreeSelect: React.FC<IProps> = ({
  sections,
  onChange,
  disabled = false,
}) => {
  const [value, setValue] = useState<string>();
  const [data, setData] = useState<DefaultOptionType[]>([]);
  const getTreeData = (sections: IData[]): DefaultOptionType[] => {
    return sections.map((item) => {
      const option: DefaultOptionType = { value: item.id, label: item.name };
      if (item.sections && item.sections.length > 0) {
        option.children = getTreeData(item.sections);
      }
      return option;
    });
  };
  useEffect(() => {
    setData(getTreeData(sections));
  }, [sections]);
  useEffect(() => {
    value && onChange(value);
  }, [value]);

  return (
    <TreeSelect
      showSearch
      style={{ width: "100%" }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Сонгоно уу."
      allowClear
      treeDefaultExpandAll
      onChange={setValue}
      treeData={data as any}
      disabled={disabled}
    />
  );
};
export default NewTreeSelect;
