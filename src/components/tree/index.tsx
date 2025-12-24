import { Tooltip, Tree } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TreeProps } from "antd/lib";
import { FileOutlined, FolderOpenOutlined } from "@ant-design/icons";
import NewItem from "./node-item";
import { NewInput } from "../input";
import { DataNode, EventDataNode } from "antd/es/tree";

const { TreeNode } = Tree;
interface IData {
  id: number;
  sectionId: number | null;
  name: string;
  isExpand: boolean;
  sections: IData[];
}
interface IProps {
  data: IData[];
  onClick?: (selectedNames: string[]) => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => void;
}
/** Мод */
const NewDirectoryTree: React.FC<IProps> = ({
  data,
  onClick,
  onEdit,
  onDelete,
}) => {
  /** Модны мөчир */
  const NewTreeNode = (data: IData[]) => {
    return data.map((item) => {
      if (item.sections) {
        return (
          <TreeNode
            title={<NewItem item={item} onEdit={onEdit} onDelete={onDelete} />}
            key={item.id}
            switcherIcon={<FolderOpenOutlined />}
          >
            {NewTreeNode(item.sections)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          title={<NewItem item={item} onEdit={onEdit} onDelete={onDelete} />}
          switcherIcon={<FileOutlined />}
        />
      );
    });
  };
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const getAllSections = (sections: IData[]): IData[] => {
    const allResources: IData[] = [];
    sections.forEach((item) => {
      allResources.push(item);
      if (item.sections && item.sections.length > 0) {
        allResources.push(...getAllSections(item.sections));
      }
    });
    return allResources;
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  const onSelect: TreeProps["onSelect"] = (_, info) => {
    const allKeys = getChildKeys(info);
    console.log("all keys ==>", allKeys);
    const sectionNames = getAllSections(data)
      .filter((item) => allKeys.includes(String(item.id)))
      .map((item) => item.name);
    onClick?.(sectionNames);
  };
  const getChildKeys = (info: {
    event: "select";
    selected: boolean;
    node: EventDataNode<DataNode>;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }): React.Key[] => {
    const childKeys: React.Key[] = [];
    const traverse = (children: DataNode[] | undefined) => {
      if (!children) return;
      for (const item of children) {
        childKeys.push(item.key);
        traverse(item.children);
      }
    };
    if (info) {
      childKeys.push(info.node.key);
      traverse(info.node.children);
    }
    return childKeys;
  };
  useEffect(() => {
    if (isExpand) {
      const keys = getAllSections(data).map((item) => String(item.id));
      onExpand(keys);
    } else onExpand([]);
  }, [isExpand]);
  return (
    <div className="directory-tree">
      <div className="header">
        {isExpand ? (
          <Tooltip title="Бүгдийг хаах">
            <Image
              onClick={() => {
                setIsExpand(false);
              }}
              src={"/images/folder.svg"}
              width={24}
              height={24}
              alt="folder"
            />
          </Tooltip>
        ) : (
          <Tooltip title="Бүгдийг нээх">
            <Image
              onClick={() => {
                setIsExpand(true);
              }}
              src={"/images/openFolder.svg"}
              width={24}
              height={24}
              alt="openfolder"
            />
          </Tooltip>
        )}
        <p>Цэсний жагсаалт</p>
      </div>
      <div className="content">
        <NewInput
          // value={searchValue}
          // onChange={(e) => {
          //   setSearchValue(e.target.value);
          // }}
          placeholder="Бүлгийн нэрээр хайх"
        />
        <Tree
          showLine
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={true}
          onSelect={onSelect}
        >
          {NewTreeNode(data)}
        </Tree>
      </div>
    </div>
  );
};
export default NewDirectoryTree;
