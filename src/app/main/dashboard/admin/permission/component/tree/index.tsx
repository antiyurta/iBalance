import { Tree } from "antd";
import {
  SearchOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from "@ant-design/icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TreeHeader } from "./header";
import { ICheck, TreeInfo } from "./info";
import { IDataResource } from "@/service/permission/resource/entities";
import { NewInput } from "@/components/input";
import { useResourceContext } from "../../context/ResourceContext";
import { IDataPermission } from "@/service/permission/entities";
import { ResourceService } from "@/service/permission/resource/service";
const { TreeNode } = Tree;
export interface ITreeDefaultData {
  viewKey: number;
  actionKeys: string[];
}
interface IProps {
  defaultData: ITreeDefaultData[];
  permissions: IDataPermission[];
  setPermissions: Dispatch<SetStateAction<IDataPermission[]>>;
}
const TreeList: React.FC<IProps> = ({
  defaultData,
  permissions,
  setPermissions,
}) => {
  const { resources } = useResourceContext();
  const [allResources, setAllResources] = useState<IDataResource[]>([]);
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [keys, setKeys] = useState<number[]>([]);
  const renderTreeNodes = (data: IDataResource[]) => {
    return data.map((item) => {
      if (item.resources) {
        return (
          <TreeNode
            title={item.label}
            key={item.id}
            switcherIcon={<FolderOpenOutlined />}
          >
            {renderTreeNodes(item.resources)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          title={
            <TreeInfo
              title={item.label}
              isEdit={Boolean(checkedKeys.find((key) => key == item.id))}
              onCheck={(value) => onNodeCheck(item, value)}
              defaultCheckedList={
                defaultData.find((value) => value.viewKey == item.id)
                  ?.actionKeys || []
              }
            />
          }
          switcherIcon={<FileOutlined />}
        />
      );
    });
  };
  const getAllResources = () => {
    ResourceService.getAll().then((response) => {
      if (response.success) {
        setAllResources(response.response);
      }
    });
  };
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log("selected", selectedKeys, info);
  };
  const onNodeCheck = (item: IDataResource, value: ICheck) => {
    const permission: IDataPermission = {
      resourceId: item.id,
      isView: true,
      isAdd: value.isAdd,
      isEdit: value.isEdit,
      isDelete: value.isDelete,
      resource: item,
    };
    console.log("is working =====>", permission);
    const updatedPermissions = [...permissions];
    const existingIndex = updatedPermissions.findIndex(
      (perm) => perm.resourceId === item.id
    );
    if (existingIndex !== -1) {
      updatedPermissions[existingIndex] = permission;
    }
    setPermissions(updatedPermissions);
  };
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleExpand(value);
  };
  const handleExpand = (value: string) => {
    if (value == "") onExpand([]);
    else {
      const expandedKeysValue = allResources
        .filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => String(item.id));
      onExpand(expandedKeysValue);
    }
  };
  const onCheck = (checkedKeys: any, info: any) => {
    setKeys([...checkedKeys, ...info.halfCheckedKeys]);
    setCheckedKeys(checkedKeys);
  };
  useEffect(() => {
    getAllResources();
  }, []);
  useEffect(() => {
    if (isExpand) {
      const keys = allResources.map((item) => String(item.id));
      onExpand(keys);
    } else onExpand([]);
  }, [isExpand]);
  useEffect(() => {
    const newPermissions: IDataPermission[] = [];
    for (const key of keys) {
      const resource = allResources.find((item) => item.id == key);
      if (resource) {
        newPermissions.push({
          resourceId: resource.id,
          isAdd: false,
          isView: true,
          isEdit: false,
          isDelete: false,
          resource,
        });
      }
    }
    setPermissions(newPermissions);
  }, [keys]);
  useEffect(() => {
    const viewKeys = defaultData.map((item) => item.viewKey.toString());
    setCheckedKeys(viewKeys);
  }, [defaultData]);
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
        checkable={true}
      >
        {renderTreeNodes(resources)}
      </Tree>
    </div>
  );
};
export default TreeList;
