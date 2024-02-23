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
const { TreeNode } = Tree;
interface ITreeDefaultData {
  viewKey: number;
  actionKeys: string[];
}
interface IProps {
  permissions: IDataPermission[];
  setPermissions: Dispatch<SetStateAction<IDataPermission[]>>;
}
const TreeList: React.FC<IProps> = ({ permissions, setPermissions }) => {
  const { resources } = useResourceContext();
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const renderTreeNodes = (data: IDataResource[]) => {
    return data.map((item) => {
      const permission = permissions.find(
        (permission) => permission.resource.id == item.id
      );
      const checkedList: string[] = [];
      if (permission) {
        permission.isAdd && checkedList.push("isAdd");
        permission.isEdit && checkedList.push("isEdit");
        permission.isDelete && checkedList.push("isDelete");
      }
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
              defaultCheckedList={checkedList}
            />
          }
          switcherIcon={<FileOutlined />}
        />
      );
    });
  };
  const getAllResources = (resources: IDataResource[]): IDataResource[] => {
    const allResources: IDataResource[] = [];
    resources.forEach((item) => {
      allResources.push(item);
      if (item.resources && item.resources.length > 0) {
        allResources.push(...getAllResources(item.resources));
      }
    });
    return allResources;
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
      const allResources = getAllResources(resources);
      const expandedKeysValue = allResources
        .filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => String(item.id));
      onExpand(expandedKeysValue);
    }
  };
  const onCheck = (checkedKeys: React.Key[], halfCheckedKeys?: React.Key[]) => {
    const keys = halfCheckedKeys
      ? checkedKeys.concat(halfCheckedKeys)
      : checkedKeys;
    console.log("keys ====>", keys);
    const newPermissions: IDataPermission[] = [];
    for (const key of keys) {
      const resource = getAllResources(resources).find(
        (item) => String(item.id) === key
      );
      if (resource) {
        newPermissions.push({
          resourceId: resource.id,
          resource,
        });
      }
    }
    console.log("newPermissions ===>", newPermissions);
    setPermissions(newPermissions);
  };
  useEffect(() => {
    if (isExpand) {
      const keys = getAllResources(resources).map((item) => String(item.id));
      onExpand(keys);
    } else onExpand([]);
  }, [isExpand]);
  useEffect(() => {
    console.log(
      "check keys ====>",
      permissions.map((item) => String(item.resource.id))
    );
    setCheckedKeys(permissions.map((item) => String(item.resource.id)));
  }, [permissions]);
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
        onCheck={(checkedKeys, { halfCheckedKeys }) =>
          onCheck(checkedKeys as React.Key[], halfCheckedKeys)
        }
        checkedKeys={checkedKeys}
        checkable={true}
      >
        {renderTreeNodes(resources)}
      </Tree>
    </div>
  );
};
export default TreeList;
