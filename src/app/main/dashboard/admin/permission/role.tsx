import NewCard from "@/components/Card";
import { NewInput, NewTextArea } from "@/components/input";
import { IDataRole } from "@/service/permission/role/entities";
import { Button, Col, Divider, Form, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { RoleService } from "@/service/permission/role/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import TreeList from "./component/tree";

export const Role = () => {
  const [form] = Form.useForm<IDataRole>();
  const blockContext: BlockView = useContext(BlockContext);
  const [roles, setRoles] = useState<IDataRole[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IDataRole>();

  const getRole = () => {
    RoleService.get().then((response) => {
      if (response.success) {
        setRoles(response.response.data);
      }
    });
  };
  const selectRole = (role?: IDataRole) => {
    setSelectedRole(role);
    setIsEdit(role ? true : false);
    if (role) {
      form.setFieldsValue({ permissions: role.permissions });
    } else {
    }
  };
  const onFinish = (values: IDataRole) => {
    blockContext.block();
    if (isEdit && selectedRole?.id) {
      RoleService.patch(selectedRole.id, values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            setSelectedRole(undefined);
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
            setSelectedRole(undefined);
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
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row>
        <Col span={8}>
          <NewCard title="Эрх">
            {roles.map((role, index) => (
              <Button
                key={index}
                style={{ width: "100%" }}
                type={selectedRole?.id == role.id ? "primary" : "default"}
                onClick={() => selectRole(role)}
              >
                {role.name}
              </Button>
            ))}
          </NewCard>
        </Col>
        <Col span={16}>
          <NewCard title="Зөвшөөрөл">
            <Form.Item name="name" label="Нэр">
              <NewInput onFocus={() => selectRole(undefined)} />
            </Form.Item>
            <Form.Item name="description" label="Тайлбар">
              <NewTextArea />
            </Form.Item>
            <Divider />
            <TreeList isEdit={true} />
            <Divider />
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{ width: "100%" }}
              >
                Хадгалах
              </Button>
            </Form.Item>
          </NewCard>
        </Col>
      </Row>
    </Form>
  );
};
