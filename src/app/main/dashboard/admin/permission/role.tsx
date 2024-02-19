import NewCard from "@/components/Card";
import { NewInput, NewTextArea } from "@/components/input";
import { IDataRole } from "@/service/permission/role/entities";
import {
  Button,
  Col,
  Divider,
  Form,
  Popconfirm,
  Row,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Fragment, useContext, useEffect, useState } from "react";
import { RoleService } from "@/service/permission/role/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import TreeList, { ITreeDefaultData } from "./component/tree";
import { IDataPermission } from "@/service/permission/entities";
import { AddButton } from "@/components/add-button";
const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
const defaultValues = {
  id: undefined,
  name: undefined,
  description: undefined,
  permissions: undefined,
};

export const Role = () => {
  const [form] = Form.useForm<IDataRole>();
  const blockContext: BlockView = useContext(BlockContext);
  const [roles, setRoles] = useState<IDataRole[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<IDataPermission[]>([]);
  const [editingIndex, setEditingIndex] = useState<number>();
  const [defaultData, setDefaultData] = useState<ITreeDefaultData[]>([]);

  const columns: TableProps<IDataRole>["columns"] = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record, index) => (
        <Fragment key={index}>
          <Tooltip title="Засах">
            <Button
              type={index == editingIndex ? "primary" : "default"}
              icon={<EditOutlined />}
              shape={"circle"}
              style={{ marginRight: 8 }}
              onClick={() => {
                setEditingIndex(index);
                setIsEdit(true);
                form.setFieldsValue(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Устгах">
            <Popconfirm
              title="Та итгэлтэй байна уу？"
              okText="Тийм"
              cancelText="Үгүй"
              onConfirm={() => onDelete(record.id)}
            >
              <Button
                danger
                icon={
                  <DeleteOutlined
                    style={{
                      color: "red",
                    }}
                  />
                }
                shape={"circle"}
              />
            </Popconfirm>
          </Tooltip>
        </Fragment>
      ),
    },
  ];
  const getRole = () => {
    RoleService.get().then((response) => {
      if (response.success) {
        setRoles(response.response.data);
      }
    });
  };
  const onFinish = (values: IDataRole) => {
    blockContext.block();
    if (permissions.length == 0 && editingIndex !== undefined) {
      values.permissions = roles[editingIndex].permissions;
    } else values.permissions = permissions;
    if (isEdit && values.id) {
      RoleService.patch(values.id, values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            setIsEdit(false);
            setEditingIndex(undefined);
            getRole();
            setDefaultData([]);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      RoleService.post(values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            setIsEdit(false);
            getRole();
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const onEdit = () => {
    if (editingIndex !== undefined) {
      const data: ITreeDefaultData[] = roles[editingIndex].permissions
        .filter((item) => item.isView && item.resource)
        .map((item) => ({
          viewKey: item.resource.id,
          actionKeys: [
            item.isAdd ? "isAdd" : undefined,
            item.isEdit ? "isEdit" : undefined,
            item.isDelete ? "isDelete" : undefined,
          ].filter(Boolean) as string[],
        }));
      setDefaultData(data);
    }
  };
  const onDelete = async (id?: number) => {
    id &&
      (await RoleService.remove(id).then((response) => {
        if (response.success) {
          getRole();
        }
      }));
  };
  useEffect(() => {
    getRole();
  }, []);
  useEffect(() => {
    console.log("it is working =======>");
    onEdit();
  }, [editingIndex]);
  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={8}>
          <NewCard
            title="Эрх"
            extra={
              <AddButton
                onClick={() => {
                  setIsEdit(false);
                  form.setFieldsValue(defaultValues);
                  setEditingIndex(undefined);
                  setDefaultData([]);
                }}
              />
            }
          >
            <Table
              rowKey={"id"}
              dataSource={roles}
              columns={columns}
              scroll={{ y: 500 }}
              pagination={false}
            />
          </NewCard>
        </Col>
        <Col span={16}>
          <NewCard title="Зөвшөөрөл">
            <Form.Item name="id" label="#">
              <NewInput disabled />
            </Form.Item>
            <Form.Item name="name" label="Нэр" required>
              <NewInput />
            </Form.Item>
            <Form.Item name="description" label="Тайлбар" required>
              <NewTextArea />
            </Form.Item>
            <Divider />
            <TreeList
              defaultData={defaultData}
              isEdit={true}
              permissions={editingIndex ? roles[editingIndex].permissions : []}
              setPermissions={setPermissions}
            />
            <Divider />
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{ width: "100%" }}
              >
                {isEdit ? "Засах" : "Хадгалах"}
              </Button>
            </Form.Item>
          </NewCard>
        </Col>
      </Row>
    </Form>
  );
};
