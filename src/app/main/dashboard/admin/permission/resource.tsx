import { NewInput, NewInputNumber } from "@/components/input";
import { TreeHeader } from "./component/tree/header";
import {
  SearchOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useResourceContext } from "./context/ResourceContext";
import { Form, Tree, TreeProps } from "antd";
import { IDataResource } from "@/service/permission/resource/entities";
import { ResourceService } from "@/service/permission/resource/service";
import NewModal from "@/components/modal";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
const { TreeNode } = Tree;
export const Resource: React.FC = () => {
  const { resources, isReload, setIsReload } = useResourceContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [form] = Form.useForm<IDataResource>();
  const [selectedResource, setSelectedResource] = useState<IDataResource>();
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
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  const renderTreeNodes = (data: IDataResource[]) => {
    return data.map((item) => {
      if (item.resources) {
        return (
          <TreeNode
            title={`${item.position} - ${item.label}`}
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
          title={`${item.position} - ${item.label}`}
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
  const onSelect: TreeProps["onSelect"] = (key) => {
    const resource = getAllResources(resources).find(
      (item) => item.id == Number(key)
    );
    if (resource) {
      setIsShow(true);
      setSelectedResource(resource);
      form.setFieldsValue(resource);
    }
  };
  const onFinish = async (values: IDataResource) => {
    if (selectedResource && selectedResource.id) {
      blockContext.block();
      await ResourceService.patch(selectedResource.id, values)
        .then((response) => {
          if (response.success) {
            setIsReload?.(!isReload);
            setIsShow(false);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    if (isExpand) {
      const keys = getAllResources(resources).map((item) => String(item.id));
      onExpand(keys);
    } else {
      onExpand([]);
    }
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
        draggable
        onSelect={onSelect}
      >
        {renderTreeNodes(resources)}
      </Tree>
      <NewModal
        title={"Цэсний тохиргоо"}
        open={isShow}
        onCancel={() => setIsShow(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Нэр" name={"label"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Байрлал" name={"position"}>
            <NewInputNumber />
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};
