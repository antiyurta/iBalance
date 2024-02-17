import NewCard from "@/components/Card";
import { Button, Divider, Form } from "antd";
import {
  IDataPermission,
  IEmployeePermission,
} from "@/service/permission/entities";
import { SetStateAction, useEffect, useState } from "react";
import { PermissionService } from "@/service/permission/service";
import TreeList from "./component/tree";
import { NewFilterSelect } from "@/components/input";
import { EmployeeService } from "@/service/employee/service";
import { IDataEmployee } from "@/service/employee/entities";
import { getUniqueValues } from "@/feature/common";
const PermissionEmployee = () => {
  const [form] = Form.useForm<IEmployeePermission>();
  const [employees, setEmployees] = useState<IDataEmployee[]>([]);
  const [permissions, setPermissions] = useState<IDataPermission[]>([]);
  const getEmployee = async () => {
    await EmployeeService.get().then((response) => {
      if (response.success) {
        setEmployees(response.response.data);
      }
    });
  };
  const onFinish = (values: IEmployeePermission) => {
    PermissionService.post(values).then((response) => {
      if (response.success) {
        response.response;
      }
    });
  };
  useEffect(() => {
    getEmployee();
  }, []);
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <NewCard title="Зөвшөөрөл">
        <Form.Item name="employeeId" label="Ажилтан">
          <NewFilterSelect
            options={employees.map((item) => ({
              value: item.id,
              label: `${item.lastName?.substring(0, 1)}. ${item.firstName}`,
            }))}
          />
        </Form.Item>
        <Divider />
        <TreeList
          isEdit={true}
          permissions={permissions}
          setPermissions={setPermissions}
        />
        <Divider />
        <Form.Item>
          <Button htmlType="submit" type="primary" style={{ width: "100%" }}>
            Хадгалах
          </Button>
        </Form.Item>
      </NewCard>
    </Form>
  );
};
export default PermissionEmployee;
