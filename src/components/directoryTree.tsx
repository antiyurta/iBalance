import { Tooltip, Tree } from "antd";
import Image from "next/image";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";
import { NewSearch } from "./input";
import { useEffect, useState } from "react";
const { DirectoryTree } = Tree;
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
//service
import { TreeMode } from "@/service/entities";
import { MeasurementType } from "@/service/material/unitOfMeasure/entities";
import { listToTree } from "@/feature/common";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { TreeSectionType } from "@/service/reference/tree-section/entities";

type TreeExtra = "FULL" | "HALF";

interface IProps {
  mode: TreeMode;
  extra: TreeExtra;
  data: any[];
  width?: string;
  isLeaf: boolean;
  onClick?: (key: number, isLeaf: boolean | undefined) => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: any) => void;
}

const NewDirectoryTree = (props: IProps) => {
  const { mode, extra, data, isLeaf, onClick, onEdit, onDelete } = props;
  const [newData, setNewData] = useState<any[]>(data);
  const defaultData: DataNode[] = [];
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
      onClick?.(Number(info.node.key), isLeaf);
    } else {
      onClick?.(Number(info.node.key), info.node.isLeaf);
    }
  };
  const getTreeData = async (data: any[]) => {
    setNewTreeData(listToTree(data));
  };
  const setMaterialToTree = async (data: any[]) => {
    setNewTreeData(listToTree(data));
  };
  //
  useEffect(() => {
    setNewData(data);
  }, [data]);
  useEffect(() => {
    if (mode === "CONSUMER" || mode === "MATERIAL" || mode === "STORAGE") {
      getTreeData(newData);
    }
  }, [newData]);
  return (
    <div className="directory-tree">
      <div className="header">
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
          <NewSearch placeholder="Бүлэгийн нэрээр хайх" />
        </div>
        {newTreeData?.length > 0 ? (
          <DirectoryTree
            titleRender={(nodeData) => {
              if (extra === "FULL") {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{nodeData.title?.toString()}</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 8,
                      }}
                    >
                      <EditOutlined onClick={() => onEdit?.(nodeData)} />
                      <DeleteOutlined
                        onClick={() => onDelete?.(nodeData.key)}
                      />
                    </div>
                  </div>
                );
              } else if (extra === "HALF") {
                return nodeData.title?.toString();
              }
            }}
            onSelect={onSelect}
            treeData={mode === "UNIT" ? unitTree : newTreeData}
          />
        ) : null}
      </div>
    </div>
  );
};
export default NewDirectoryTree;
