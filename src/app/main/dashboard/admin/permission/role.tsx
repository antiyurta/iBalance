import NewCard from "@/components/Card";
import { NewCheckbox, NewInput, NewTextArea } from "@/components/input";
import { IDataRole, IParamRole } from "@/service/permission/role/entities";
import { Button, Col, Form, Row, Space } from "antd";
import Image from "next/image";
import { PermissionList } from "./permission";
import { useContext, useEffect, useState } from "react";
import { RoleService } from "@/service/permission/role/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

export const Role = () => {
  const [form] = Form.useForm<IDataRole>();
  const blockContext: BlockView = useContext(BlockContext);
  const [roles, setRoles] = useState<IDataRole[]>([]);
  const [params, setParams] = useState<IParamRole>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IDataRole>();

  const getRole = () => {
    RoleService.get(params).then((response) => {
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
            <Form.Item name="name" label="Нэр">
              <NewInput onFocus={() => selectRole(undefined)} />
            </Form.Item>
            <Form.Item name="description" label="Тайлбар">
              <NewTextArea />
            </Form.Item>
          </NewCard>
        </Col>
        <Col span={16}>
          <NewCard title="Зөвшөөрөл">
            <PermissionList form={form} isEdit={isEdit} />
            <Form.Item>
              <Button htmlType="submit">Хадгалах</Button>
            </Form.Item>
          </NewCard>
        </Col>
      </Row>
    </Form>
  );
};
