import { Tooltip, Tree } from "antd";
import Image from "next/image";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";
import { NewSearch } from "./input";
import { useEffect, useState } from "react";
const { DirectoryTree } = Tree;

//service
import { ConsumerSectionService } from "@/service/consumer/section/service";
import { TreeSectionType } from "@/service/consumer/section/entities";
import { TreeMode } from "@/service/entities";
import { MeasurementType } from "@/service/material/unitOfMeasure/entities";

interface IProps {
  mode?: TreeMode;
  width?: string;
  type?: TreeSectionType;
  isLeaf: boolean;
  open: boolean;
  onClick?: (key: number | string, isLeaf: boolean | undefined) => void;
}

const NewDirectoryTree = (props: IProps) => {
  const { mode, width, type, isLeaf, open, onClick } = props;
  const [newTreeData, setNewTreeData] = useState<DataNode[]>([]);
  const unitTree: DataNode[] = [
    {
      title: "Хэмжих нэгжийн бүлэг",
      key: "0-0",
      children: [
        {
          title: "Тооны хэмжих нэгж",
          key: MeasurementType.Quantity,
          isLeaf: true,
        },
        {
          title: "Уртын хэмжих нэгж",
          key: MeasurementType.Length,
          isLeaf: true,
        },
        {
          title: "Шингэний хэмжих нэгж",
          key: MeasurementType.Volume,
          isLeaf: true,
        },
        {
          title: "Талбайн хэмжих нэгж",
          key: MeasurementType.Area,
          isLeaf: true,
        },
        {
          title: "Цаг хугацааны хэмжих нэгж",
          key: MeasurementType.Time,
          isLeaf: true,
        },
        {
          title: "Хүндийн хэмжих нэгж",
          key: MeasurementType.Weight,
          isLeaf: true,
        },
      ],
    },
  ];
  const onSelect: DirectoryTreeProps["onSelect"] = async (keys, info) => {
    if (isLeaf && info.node.isLeaf) {
      onClick?.(info.node.key, isLeaf);
    } else {
      onClick?.(info.node.key, info.node.isLeaf);
    }
  };
  const getConsumerSection = async () => {
    if (type)
      await ConsumerSectionService.get(type).then((response) => {
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
    if (mode != "UNIT" && open) {
      getConsumerSection();
    }
  }, [open]);
  if (open) {
    return (
      <div
        className="directory-tree"
        style={{
          maxWidth: width,
          width: width,
        }}
      >
        <div
          className="header"
          style={{
            maxWidth: width,
            width: width,
          }}
        >
          <Tooltip title="Бүгдийг хаах">
            <Image
              src={"/images/folder.svg"}
              width={24}
              height={24}
              alt="folder"
            />
          </Tooltip>
          <Image
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
          {newTreeData ? (
            <DirectoryTree onSelect={onSelect} treeData={newTreeData} />
          ) : null}
          {mode === "UNIT" ? (
            <DirectoryTree onSelect={onSelect} treeData={unitTree} />
          ) : null}
        </div>
      </div>
    );
  }
  return;
};
export default NewDirectoryTree;
