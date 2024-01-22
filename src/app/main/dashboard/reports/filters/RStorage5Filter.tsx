import "dayjs/locale/mn";
import { useEffect } from "react";
import { useReportContext } from "@/feature/context/ReportsContext";
import DateIntervalForm from "@/components/dateIntervalForm";
import { NewReportSectionSelect } from "../component/report-section-select";
import { NewReportSelect } from "../component/report-select";
import { Form } from "antd";
import { NewInput, NewSwitch } from "@/components/input";
import { NewReportSwitch } from "../component/report-switch";

const RStorage1Filter = () => {
  const {
    form,
    employees,
    sections,
    materialSections,
    warehouses,
    materials,
    brands,
    setEmployeeIds,
    setFormStyle,
  } = useReportContext();
  const employeeIds = Form.useWatch("employeeIds", form);
  useEffect(() => {
    employeeIds && setEmployeeIds(employeeIds);
  }, [employeeIds]);
  useEffect(() => {
    setFormStyle({ width: 600, margin: "auto" });
  }, []);
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
        label={"Нярав:"}
        name={"employeeIds"}
        selectProps={{
          options: employees.map((item) => ({
            value: item.id,
            label: `${item.lastName}-${item.firstName}`,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel="Байршилын бүлэг:"
        sectionName="warehouseSectionId"
        sectionSelectProps={{
          options: sections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label="Байршил:"
        name="warehouseId"
        selectProps={{
          options: warehouses.map((item) => ({
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
export default RStorage1Filter;
