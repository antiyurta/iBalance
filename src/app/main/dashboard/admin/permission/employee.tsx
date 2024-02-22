import NewCard from "@/components/Card";
import { Button, Divider, Form } from "antd";
import {
  IDataPermission,
  IEmployeePermission,
} from "@/service/permission/entities";
import { useEffect, useState } from "react";
import { PermissionService } from "@/service/permission/service";
import TreeList, { ITreeDefaultData } from "./component/tree";
import { NewCheckbox, NewFilterSelect, NewInput } from "@/components/input";
import { EmployeeService } from "@/service/employee/service";
import { IDataEmployee } from "@/service/employee/entities";
const PermissionEmployee = () => {
  const [form] = Form.useForm<IEmployeePermission>();
  const [employees, setEmployees] = useState<IDataEmployee[]>([]);
  const [defaultPermissions, setDefaultPermissions] = useState<
    IDataPermission[]
  >([]);
  const [permissions, setPermissions] = useState<IDataPermission[]>([]);
  const [defaultData, setDefaultData] = useState<ITreeDefaultData[]>([]);
  const getEmployee = async () => {
    await EmployeeService.get({ isWarehouseRole: true }).then((response) => {
      if (response.success) {
        setEmployees(response.response.data);
      }
    });
  };
  const onFinish = (values: IEmployeePermission) => {
    if (permissions.length == 0) {
      values.permissions = defaultPermissions;
    } else values.permissions = permissions;
    PermissionService.post(values).then((response) => {
      if (response.success) {
        form.resetFields();
        setDefaultData([]);
      }
    });
  };
  const onEdit = async (employeeId: number) => {
    const employee = employees.find((item) => item.id == employeeId);
    if (employee) {
      form.setFieldValue("warehouseRole", employee.warehouseRole?.name);
      form.setFieldValue("isTreasure", employee.isTreasure);
      form.setFieldValue("isCashier", employee.isCashier);
      await PermissionService.get({ employeeId }).then(async (response) => {
        if (response.success) {
          if (response.response.length > 0) {
            getDefaultData(response.response);
            setPermissions(response.response);
          } else {
            await PermissionService.get({
              roleId: employee.warehouseRoleId,
              isView: true,
            }).then((response) => {
              if (response.success) {
                getDefaultData(response.response);
                setPermissions(response.response);
              }
            });
          }
        }
      });
    }
  };
  const getDefaultData = (permissions: IDataPermission[]) => {
    setDefaultPermissions(permissions);
    const data: ITreeDefaultData[] = permissions
      .filter((item) => item.isView && item.resource)
      .map((item) => {
        console.log('item ======>', item);
        return {
          viewKey: item.resource.id,
          actionKeys: [
            item.isAdd ? "isAdd" : undefined,
            item.isEdit ? "isEdit" : undefined,
            item.isDelete ? "isDelete" : undefined,
          ].filter(Boolean) as string[],
        };
      });
    console.log("default data =====>", data);
    setDefaultData(data);
  };
  useEffect(() => {
    getEmployee();
  }, []);
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <NewCard title="Зөвшөөрөл">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          <Form.Item name="employeeId" label="Ажилтан">
            <NewFilterSelect
              onSelect={(id) => {
                onEdit(id);
              }}
              options={employees.map((item) => ({
                value: item.id,
                label: `${item.lastName?.substring(0, 1)}. ${item.firstName}`,
              }))}
            />
          </Form.Item>
          <Form.Item name={"warehouseRole"} label="Чиг үүрэг">
            <NewInput disabled />
          </Form.Item>
          <Form.Item name={"isTreasure"} label="Нярав эсэх">
            <NewCheckbox disabled />
          </Form.Item>
          <Form.Item
            name={"isCashier"}
            label="Кассчин эсэх"
            valuePropName="checked"
          >
            <NewCheckbox disabled />
          </Form.Item>
        </div>
        <Divider />
        <TreeList
          permissions={permissions}
          setPermissions={setPermissions}
          defaultData={defaultData}
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
