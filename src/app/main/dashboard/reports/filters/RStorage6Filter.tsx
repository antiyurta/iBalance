import DateIntervalForm from "@/components/dateIntervalForm";
import { NewInput } from "@/components/input";
import { useReportContext } from "@/feature/context/ReportsContext";
import { Form } from "antd";
import { NewReportSelect } from "../component/report-select";
import { NewReportSectionSelect } from "../component/report-section-select";
import { NewReportSwitch } from "../component/report-switch";
import { useEffect, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Operator } from "@/service/entities";
type Trans = "income" | "expense";
const RStorage6Filter = () => {
  const {
    form,
    employees,
    sections,
    materialSections,
    materials,
    brands,
    setFormStyle,
  } = useReportContext();
  const [incomeWarehouses, setIncomeWarehouses] = useState<IDataWarehouse[]>(
    []
  );
  const [expenseWarehouses, setExpenseWarehouses] = useState<IDataWarehouse[]>(
    []
  );
  const incomeEmployeeIds = Form.useWatch("incomeEmployeeIds", form);
  const expenseEmployeeIds = Form.useWatch("expenseEmployeeIds", form);
  const getWarehouses = async (trans: Trans, params: IParamWarehouse) => {
    await WarehouseService.get(params).then((response) => {
      if (response.success) {
        trans == "income" && setIncomeWarehouses(response.response.data);
        trans == "expense" && setExpenseWarehouses(response.response.data);
      }
    });
  };
  useEffect(() => {
    setFormStyle({ width: 600, margin: "auto" });
  }, []);
  useEffect(() => {
    incomeEmployeeIds &&
      getWarehouses("income", {
        filters: [
          {
            dataIndex: ["employeeId"],
            operator: Operator.In,
            filter: [...incomeEmployeeIds],
          },
        ],
      });
  }, [incomeEmployeeIds]);
  useEffect(() => {
    expenseEmployeeIds &&
      getWarehouses("expense", {
        filters: [
          {
            dataIndex: ["employeeId"],
            operator: Operator.In,
            filter: [...incomeEmployeeIds],
          },
        ],
      });
  }, [expenseEmployeeIds]);
  return (
    <>
      <DateIntervalForm
        form={form}
        intervalStyle={{
          minWidth: 100,
        }}
        dateStyle={{
          width: "100%",
        }}
        label=""
        labelForDate="Огноо"
        itemname={"interval"}
      />
      <Form.Item label="Баримтын дугаар" name="documentCode">
        <NewInput />
      </Form.Item>
      <NewReportSelect
        label={"Орлогын нярав:"}
        name={"incomeEmployeeIds"}
        selectProps={{
          options: employees.map((item) => ({
            value: item.id,
            label: `${item.lastName}-${item.firstName}`,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel="Орлогын байршилын бүлэг:"
        sectionName="warehouseSectionId"
        sectionSelectProps={{
          options: sections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label="Орлогын байршил:"
        name="warehouseId"
        selectProps={{
          options: incomeWarehouses.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
      />
      <NewReportSelect
        label={"Зарлагын нярав:"}
        name={"expenseEmployeeIds"}
        selectProps={{
          options: employees.map((item) => ({
            value: item.id,
            label: `${item.lastName}-${item.firstName}`,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel="Зарлагын байршилын бүлэг:"
        sectionName="warehouseSectionId"
        sectionSelectProps={{
          options: sections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label="Зарлагын байршил:"
        name="warehouseId"
        selectProps={{
          options: expenseWarehouses.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel={"Барааны бүлэг:"}
        sectionName={"materalSectionId"}
        sectionSelectProps={{
          options: materialSections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label={"Бараа:"}
        name={"materialId"}
        selectProps={{
          options: materials.map((item) => ({
            value: item.id,
            label: `${item.code}-${item.name}`,
          })),
        }}
      />
      <NewReportSelect
        label={"Брэнд:"}
        name={"brandId"}
        selectProps={{
          options: brands.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
      />
      <NewReportSwitch name="isLock" label="Зөвхөн түгжсэн гүйлгээг харуулах" />
    </>
  );
};
export default RStorage6Filter;
