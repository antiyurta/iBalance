"use client";
import { Tooltip, Tree } from "antd";
import Image from "next/image";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";
import { NewSearch } from "./input";
import { useEffect, useState } from "react";
const { DirectoryTree } = Tree;

//service
import { ConsumerSectionService } from "@/service/consumer/section/service";

interface IProps {
  open: boolean;
  onClick: (key: number | string) => void;
}

const NewDirectoryTree = (props: IProps) => {
  const { open, onClick } = props;
  const [isExpandTree, setIsExpandTree] = useState<boolean>(false);
  const [expand, setExpand] = useState(["9-1"]);
  const [newTreeData, setNewTreeData] = useState<DataNode[]>([]);
  const onSelect: DirectoryTreeProps["onSelect"] = async (keys, info) => {
    if (info.node.isLeaf) {
      onClick(info.node.key);
    }
  };
  const dd = () => {
    const dd = newTreeData.map((item) =>
      Object.assign({}, item, {
        expanded: true,
      })
    );
    console.log(dd);
  };
  const getConsumerSection = async () => {
    await ConsumerSectionService.get().then((response) => {
      let root: DataNode[] = [];
      const data = response.response;
      const cloneData: DataNode[] = data.map((el, index) => {
        return {
          title: el.name,
          key: el.id,
          parentId: el.sectionId,
          isLeaf: !el.isExpand ? !el.isExpand : undefined,
        };
      });
      const idMapping = data.reduce((acc: any, el: any, i) => {
        acc[el.id] = i;
        return acc;
      }, {});
      cloneData.forEach((el: any) => {
        if (el.parentId === null) {
          root.push(el);
          return;
        }
        const parentEl = cloneData[idMapping[el.parentId]];
        parentEl.children = [...(parentEl.children || []), el];
      });
      setNewTreeData(root);
    });
  };
  useEffect(() => {
    open && getConsumerSection();
  }, [open]);
  if (open) {
    return (
      <div className="directory-tree">
        <div className="header">
          <Tooltip title="Бүгдийг хаах">
            <Image
              onClick={() => setExpand([])}
              src={"/images/folder.svg"}
              width={24}
              height={24}
              alt="folder"
            />
          </Tooltip>
          <Image
            onClick={() => dd()}
            src={"/images/openFolder.svg"}
            width={24}
            height={24}
            alt="openfolder"
          />
          <p>Бүлгийн нэр</p>
        </div>
        <div className="content">
          <div
            style={{
              padding: "0 12px",
            }}
          >
            <NewSearch />
          </div>
          {newTreeData && (
            <DirectoryTree
              defaultExpandedKeys={["0", "1"]}
              onSelect={onSelect}
              treeData={newTreeData}
            />
          )}
        </div>
      </div>
    );
  }
  return;
};
export default NewDirectoryTree;
