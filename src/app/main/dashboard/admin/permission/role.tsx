import NewCard from "@/components/Card";
import { NewInput, NewTextArea } from "@/components/input";
import { IDataRole } from "@/service/permission/role/entities";
import {
  Button,
  Col,
  Divider,
  Form,
  Row,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import { AuditOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { RoleService } from "@/service/permission/role/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import TreeList from "./component/tree";
import { IDataPermission } from "@/service/permission/entities";
import NewModal from "@/components/modal";
import { RoleInfo } from "./component/role-info";
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
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IDataRole>();
  const columns: TableProps<IDataRole>["columns"] = [
    {
      title: "Нэр",
      key: "name",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setIsEdit(true);
            form.setFieldsValue(record);
            setPermissions(record.permissions);
          }}
        >
          {record.name}
        </Button>
      ),
    },
    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Дэлгэрэнгүй харах">
          <Button
            type="primary"
            shape="circle"
            icon={<AuditOutlined />}
            onClick={() => {
              setIsModal(true);
              setSelectedRole(record);
            }}
          />
        </Tooltip>
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
    values.permissions = permissions;
    if (isEdit && values.id) {
      RoleService.patch(values.id, values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            setIsEdit(false);
            getRole();
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
  useEffect(() => {
    getRole();
  }, []);
  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={8}>
          <NewCard
            title="Эрх"
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsEdit(false);
                  form.setFieldsValue(defaultValues);
                }}
              >
                Нэмэх
              </Button>
            }
          >
            <Table
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
            <Form.Item name="name" label="Нэр">
              <NewInput />
            </Form.Item>
            <Form.Item name="description" label="Тайлбар">
              <NewTextArea />
            </Form.Item>
            <Divider />
            <TreeList
              isEdit={true}
              permissions={permissions}
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
        <NewModal
          title={selectedRole?.name}
          open={isModal}
          onCancel={() => setIsModal(false)}
          footer={false}
        >
          <RoleInfo role={selectedRole} />
        </NewModal>
      </Row>
    </Form>
  );
};
