import { Tooltip, Tree } from "antd";
import Image from "next/image";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";
import { NewInput } from "./input";
import { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FileOutlined, FolderOpenOutlined } from "@ant-design/icons";

type TreeExtra = "FULL" | "HALF";

interface IData {
  id: number;
  sectionId: number | null;
  name: string;
  isExpand: boolean;
}

interface IProps {
  data: IData[];
  isLeaf: boolean;
  extra: TreeExtra;
  onClick?: (keys: number[], isLeaf?: boolean) => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: any) => void;
}

interface xDataNote extends DataNode {
  parentId?: number | null;
}

let defaultData: DataNode[] = [];

interface Node {
  id: number;
  parentId: number | null;
}

const NewDirectoryTree = (props: IProps) => {
  const { data, isLeaf, extra, onClick, onDelete, onEdit } = props;
  // shiner bichew
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const dataList: { key: React.Key; title: string }[] = [];
  const generateList = (data: DataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: key as string });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(defaultData);
  const onSelect: DirectoryTreeProps["onSelect"] = async (keys, info) => {
    if (!isLeaf) {
      const childrenIds = getChildrenIds(
        info.node.key as number,
        data.map((item) => ({
          id: item.id,
          parentId: item.sectionId,
        }))
      );
      if (childrenIds.length === 0) {
        onClick?.([Number(info.node.key)]);
      } else {
        onClick?.([Number(info.node.key), ...childrenIds]);
      }
    } else {
      const selectedNode = data.find((item) => item.id === info.node.key);
      onClick?.([info.node.key as number], selectedNode?.isExpand);
    }
  };
  function getChildrenIds(parentId: number | null, nodes: Node[]): number[] {
    const childrenIds: number[] = [];
    for (const node of nodes) {
      if (node.parentId === parentId) {
        const nodeChildrenIds = getChildrenIds(node.id, nodes);
        childrenIds.push(node.id, ...nodeChildrenIds);
      }
    }
    return childrenIds;
  }
  const getParentKey = (
    key: React.Key | null,
    tree: xDataNote[]
  ): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: xDataNote) => item.parentId === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };
  const getExpandKeys = (value: string) => {
    return data
      .map((item) => {
        if (item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
          return getParentKey(item.sectionId, defaultData);
        }
        return null;
      })
      .filter(
        (item, i, self): item is React.Key =>
          !!(item && self.indexOf(item) === i)
      );
  };
  const onSearch = (value: string) => {
    const newExpandedKeys = getExpandKeys(value);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const generateData = () => {
    let root: DataNode[] = [];
    const cloneData: xDataNote[] = data?.map((el) => {
      return {
        title: el.name as string,
        key: el.id,
        parentId: el.sectionId ? el.sectionId : null,
        isLeaf: !el.isExpand ? !el.isExpand : undefined,
      };
    });
    const idMapping = data.reduce(
      (acc: { [key: number]: number }, el, i: number) => {
        acc[el.id] = i;
        return acc;
      },
      []
    );
    cloneData?.forEach((el) => {
      if (el.parentId === null) {
        root.push(el);
        return;
      }
      const parentEl = cloneData?.[idMapping[el.parentId as number]];
      parentEl!.children = [...(parentEl?.children || []), el];
    });
    defaultData = root;
  };
  generateData();
  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(defaultData);
  }, [searchValue, data]);
  useEffect(() => {
    if (searchValue != "") {
      onSearch(searchValue);
    }
  }, [searchValue]);
  //
  return (
    <div className="directory-tree">
      <div className="header">
        <Tooltip title="Бүгдийг хаах">
          <Image
            onClick={() => {
              setExpandedKeys([]);
              setSearchValue("");
            }}
            src={"/images/folder.svg"}
            width={24}
            height={24}
            alt="folder"
          />
        </Tooltip>
        <Tooltip title="Бүгдийг нээх">
          <Image
            onClick={() => {
              const keys = getExpandKeys("");
              setExpandedKeys(keys);
            }}
            src={"/images/openFolder.svg"}
            width={24}
            height={24}
            alt="openfolder"
          />
        </Tooltip>

        <p>Бүлгийн нэр</p>
      </div>
      <div className="content">
        <div
          style={{
            padding: "0 12px",
          }}
        >
          <NewInput
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            placeholder="Бүлэгийн нэрээр хайх"
          />
        </div>
        <Tree
          rootStyle={{
            padding: "0 12px",
          }}
          showLine
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          titleRender={(nodeData) => {
            const title: string = nodeData.title as string;
            if (extra === "FULL") {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 12,
                    }}
                  >
                    <div>
                      {data.find((item) => item.id === nodeData.key)
                        ?.isExpand ? (
                        <FolderOpenOutlined />
                      ) : (
                        <FileOutlined />
                      )}
                    </div>
                    <span>{title}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <EditOutlined
                      onClick={() => {
                        onEdit?.(data.find((item) => item.id === nodeData.key));
                      }}
                    />
                    <DeleteOutlined onClick={() => onDelete?.(nodeData.key)} />
                  </div>
                </div>
              );
            } else if (extra === "HALF") {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <div>
                    {data.find((item) => item.id === nodeData.key)?.isExpand ? (
                      <FolderOpenOutlined />
                    ) : (
                      <FileOutlined />
                    )}
                  </div>
                  <span>{title}</span>
                </div>
              );
            }
          }}
          onSelect={onSelect}
          // treeData={mode === "UNIT" ? unitTree : newTreeData}
          treeData={treeData}
        />
      </div>
    </div>
  );
};
export default NewDirectoryTree;