import { NewDatePicker } from "@/components/input";
import { Form } from "antd";
import { NewReportSelect } from "../component/report-select";
import { useReportContext } from "@/feature/context/ReportsContext";
import { useEffect } from "react";
import { NewReportSectionSelect } from "../component/report-section-select";
import { NewReportSwitch } from "../component/report-switch";

const RStorage3Filter = () => {
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
      <Form.Item label="Огноо" name="documentAt">
        <NewDatePicker />
      </Form.Item>
      <NewReportSelect
        form={form}
        label={"Нярав:"}
        name={"employeeId"}
        selectProps={{
          options: employees.map((item) => ({
            value: item.id,
            label: `${item.lastName}-${item.firstName}`,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel={"Байршилын бүлэг:"}
        sectionName={"warehouseSectionId"}
        sectionSelectProps={{
          options: sections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label={"Байршил:"}
        name={"warehouseId"}
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
        form={form}
        label={"Брэнд"}
        name={"brandId"}
        selectProps={{
          options: brands.map((item) => ({ value: item.id, label: item.name })),
        }}
      />
      <NewReportSwitch name="isLock" label="Зөвхөн түгжсэн гүйлгээг харуулах" />
      <NewReportSwitch
        name="isActive"
        label="Гүйлгээ гараагүй (идэвхтэй) барааны үлдэгдэл харуулах"
      />
    </>
  );
};
export default RStorage3Filter;
