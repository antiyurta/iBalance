import { Tree } from "antd";
import {
  SearchOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TreeHeader } from "./header";
import { TreeInfo } from "./info";
import { IDataResource } from "@/service/permission/resource/entities";
import { NewInput } from "@/components/input";
import { useResourceContext } from "../../context/ResourceContext";
const { TreeNode } = Tree;
interface IProps {
    isEdit?: boolean;
}
const TreeList: React.FC<IProps> = ({ isEdit }) => {
  const { resources } = useResourceContext();
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const renderTreeNodes = (data: IDataResource[]) => {
    return data.map((item) => {
      if (item.resources) {
        return (
          <TreeNode
            title={item.label}
            key={item.key}
            switcherIcon={<FolderOpenOutlined />}
          >
            {renderTreeNodes(item.resources)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          title={<TreeInfo title={item.label} isEdit={isEdit} />}
          switcherIcon={<FileOutlined />}
        />
      );
    });
  };
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log("selected", selectedKeys, info);
  };
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleExpand(value);
  };
  const handleExpand = (value: string) => {
    const expandedKeysValue = resources
      .map((item) => {
        if (item.label.toLowerCase().includes(value.toLowerCase())) {
          return item.key;
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i) as string[];
    setExpandedKeys(expandedKeysValue);
  };
  const onCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys);
  };
  useEffect(() => {
    if (isExpand) handleExpand("");
    else setExpandedKeys([]);
  }, [isExpand]);
  return (
    <div className="directory-tree">
      <TreeHeader isExpand={isExpand} setIsExpand={setIsExpand} />
      <NewInput
        placeholder="Search"
        onChange={onChange}
        style={{ width: "100%" }}
        prefix={<SearchOutlined />}
      />
      <Tree
        showLine
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={true}
        onSelect={onSelect}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        checkable={isEdit}
      >
        {renderTreeNodes(resources)}
      </Tree>
    </div>
  );
};
export default TreeList;
