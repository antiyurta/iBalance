import NewCard from "@/components/Card";
import { Button, Col, Form, Row } from "antd";
import { PermissionList } from "./permission";
import { IEmployeePermission } from "@/service/permission/entities";
import { UserSelect } from "@/components/user-select";
import { useState } from "react";
import { PermissionService } from "@/service/permission/service";
const PermissionUser = () => {
  const [form] = Form.useForm<IEmployeePermission>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onFinish = (values: IEmployeePermission) => {
    PermissionService.post(values).then((response) => {
        if (response.success) {
            response.response
        }
    })
  };
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row>
        <Col span={8}>
          <NewCard title="Эрх">
            <UserSelect form={form} rules={[]} name="userId" />
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
export default PermissionUser;
