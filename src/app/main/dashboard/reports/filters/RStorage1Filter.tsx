import { NewFilterSelect, NewSelect } from "@/components/input";
import { Form } from "antd";
import "dayjs/locale/mn";
import { FormInstance } from "antd/lib";
import DateIntervalForm from "@/components/dateIntervalForm";
import { useEffect, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { IDataEmployee } from "@/service/employee/entities";
import { EmployeeService } from "@/service/employee/service";
import { useWatch } from "antd/es/form/Form";
import DatePicker from "react-multi-date-picker";

interface IProps {
  form: FormInstance;
}

const RStorage1Filter = (props: IProps) => {
  const { form } = props;
  const [employees, setEmployees] = useState<IDataEmployee[]>([]);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState<boolean>(false);
  const sectionId = Form.useWatch("sectionId", form);
  const employeeId = useWatch("employeeId", form);
  const getWarehouses = async (params: IParamWarehouse) => {
    setIsWarehouseLoading(true);
    await WarehouseService.get(params)
      .then((response) => {
        if (response.success) {
          const warehouses = response.response.data;
          setWarehouses(warehouses);
        }
      })
      .finally(() => setIsWarehouseLoading(false));
  };
  const getWarehousesBySectionIds = async (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      setWarehouses(response.response.data);
    });
  };
  const getEmployee = async () => {
    await EmployeeService.get({ isTreasure: true }).then((response) => {
      if (response.success) {
        setEmployees(response.response.data);
      }
    });
  };
  useEffect(() => {
    getWarehousesBySectionIds({
      sectionIds: sectionId,
    });
  }, [sectionId]);
  useEffect(() => {
    getEmployee();
  }, []);
  useEffect(() => {
    employeeId && getWarehouses({ employeeId: employeeId });
  }, [employeeId]);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0,1fr))",
        gap: 12,
        alignItems: "flex-end",
      }}
    >
      <DateIntervalForm
        form={form}
        itemname={"interval"}
      />
      <Form.Item label="Нярав" name="employeeId">
        <NewFilterSelect
          options={employees.map((employee) => ({
            value: employee.id,
            label: `${employee.lastName?.substring(0, 1).toUpperCase()}. ${
              employee.firstName
            }`,
          }))}
        />
      </Form.Item>
      <Form.Item label="Байршил" name="warehouseId">
        <NewFilterSelect
          loading={isWarehouseLoading}
          options={warehouses.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      </Form.Item>
      <Form.Item label="Барааны төрөл">
        <NewSelect
          options={[
            {
              label: "Бүлэг",
            },
          ]}
        />
      </Form.Item>
    </div>
  );
};
export default RStorage1Filter;
